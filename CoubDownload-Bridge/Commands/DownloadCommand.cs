using Consolas.Core;
using CoubDownload_Bridge.API;
using CoubDownload_Bridge.Args;
using FFmpeg.NET;
using System;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Konsole;
using System.Text;
using System.Collections.Generic;
using System.Windows.Threading;
using CoubDownload_Bridge.Utils;

namespace CoubDownload_Bridge.Commands
{
    public class DownloadCommand : Command
    {
        public string CoubId { get; private set; }
        private string currentPath { get => AppDomain.CurrentDomain.BaseDirectory; }
        private string tempPath { get => Path.Combine(this.currentPath, "tmp"); }
        private string _outputPath { get => App.Config.outputPath; }
        private string ffmpegPath { get => Path.Combine(this.currentPath, "FFMPEG", "ffmpeg.exe"); }
        public string Execute(DownloadArgs args)
        {
            if (App.Config == null)
            {
                App.Config = new Config().Load();
            }
            if (App.Config.silentWebProcessing)
            {
                Task.Run((async () =>
                {
                    return new DownloadCommand().Execute(args);
                }));
                return "async processing...";
            }
            var outputPath = _outputPath;
            var overallProgress = new ProgressBar(PbStyle.SingleLine, args.audio != true ? 3 : 2, 20, '█');
            overallProgress.Refresh(0, "Overall Progress");
            if (args.download.Length == 0)
            {
                return "Invalid ID";
            }
            string CoubId = args.download;
            bool startedFromBrowser = false;
            if (CoubId.ToLower().StartsWith("coubdl-bridge"))
            {
                startedFromBrowser = true;
                CoubId = CoubId.Substring("coubdl-bridge://".Length);
                var csId = CoubId.Split('/');
                if (csId.Length > 1)
                {
                    CoubId = csId.FirstOrDefault();
                    if (csId.Contains("audio"))
                    {
                        args.audio = true;
                    }
                    if (csId.Contains("gif"))
                    {
                        args.gif = true;
                    }
                    if (csId.Contains("full"))
                    {
                        args.full = true;
                    }
                }
            }
            if (CoubId.EndsWith("/"))
            {
                CoubId = CoubId.Substring(0, CoubId.Length - 1);
            }
            if (CoubId.StartsWith("http"))
            {
                var reg = new Regex(@"(http|https)?:\/\/(www\.)?coub\.com\/view\/([a-zA-Z\d]+)");
                if (reg.IsMatch(CoubId))
                {
                    CoubId = reg.Match(CoubId)?.Groups[3]?.Value ?? CoubId;
                }
            }
            if (!Directory.Exists(outputPath))
            {
                Directory.CreateDirectory(outputPath);
            }
            if (!Directory.Exists(this.tempPath))
            {
                Directory.CreateDirectory(this.tempPath);
            }
            Debug.WriteLine(this.ffmpegPath);
            var cl = new Coub();
            var data = cl.getCoubById(CoubId).Result;
            var audio = data.AudioVersions?.Template ?? data.FileVersions.Html5.Audio?.High?.Url ?? data.FileVersions.Html5.Audio?.Med?.Url;
            var video = data.FileVersions.Html5.Video.High?.Url ?? data.FileVersions.Html5.Video.Med.Url;
            var wc = new WebClient();
            var videoInput = Path.Combine(tempPath, $"video_{data.Id}-({Guid.NewGuid().ToString()}).tmp");
            var audioInput = Path.Combine(tempPath, $"audio_{data.Id}-({Guid.NewGuid().ToString()}).tmp");

            var dataCommunity = $"{(App.Config.addCommunityPrefix ? $"{data.Communities?.Where(x => x.Visible != false)?.FirstOrDefault()?.Title ?? ""}" : "")}";
            var dataCategory = $"{(App.Config.addCategoryPrefix ? $"{data.Categories?.Where(x => x.Visible != false && (App.Config.addCommunityPrefix ? (x.Title != dataCommunity) : true))?.FirstOrDefault()?.Title ?? "General"}" : "")}";
            dataCommunity = dataCommunity.EndsWith("[]") ? "" : dataCommunity;
            dataCategory = dataCategory.EndsWith("[]") ? "" : dataCategory;
            var resultOutputPrefix = new StringBuilder();
            var category = dataCategory;
            var community = dataCommunity;
            var fileFormatName = App.Config.customFilenameFormat ?? "[%category%]%id%";
            if (!App.Config.nsfwFolderEnabled || data.Communities?.Count(x => x.Title?.ToLower().IndexOf("nsfw") != -1) == 0 ||
                data.Categories?.Count(x => x.Title?.ToLower().IndexOf("nsfw") != -1) == 0)
            {
                if (App.Config.categoryToFolderMatchEnabled && (!string.IsNullOrEmpty(resultOutputPrefix.ToString())))
                {
                    outputPath = Path.Combine(outputPath, resultOutputPrefix.ToString());
                    if (!Directory.Exists(outputPath))
                    {
                        Directory.CreateDirectory(outputPath);
                    }
                }
            }
            else
            {
                outputPath = Path.Combine(outputPath, "nsfw");
                if (!Directory.Exists(outputPath))
                {
                    Directory.CreateDirectory(outputPath);
                }
            }
            var formatVariables = new Tuple<string, string>[]
            {
                Tuple.Create("id", CoubId),
                Tuple.Create("category", category),
                Tuple.Create("community", community),
                Tuple.Create("name", data.Title.SanitizeFilename())
            };
            var outFileName = fileFormatName.ReplaceVariables(formatVariables);
            var resultOutput = Path.Combine(outputPath, $"{outFileName}{(args.full ? "-full" : "")}.mp4");
            var resultOutputAudio = Path.Combine(outputPath, $"{outFileName}.mp3");
            var resultGif = Path.Combine(outputPath, $"{outFileName}.gif");

            var withPercentage = new ProgressBar(PbStyle.SingleLine, 100, 20, '█');
            var currentType = CoubDownloadType.Video;
            wc.DownloadProgressChanged += (s, e) =>
            {
                withPercentage.Refresh(e.ProgressPercentage, $"Downloading {currentType.ToString()}");
            };
            wc.DownloadDataCompleted += async (s, e) =>
            {
                withPercentage.Refresh(e.Cancelled ? 0 : withPercentage.Max, $"Downloading {currentType.ToString()}");
            };
            wc.DownloadFileCompleted += async (s, e) =>
            {
                withPercentage.Refresh(e.Cancelled ? 0 : withPercentage.Max, $"Downloading {currentType.ToString()}");
            };
            if (args.audio != true)
            {
                withPercentage.Refresh(0, $"Downloading {currentType.ToString()}");
                var dlVideo = wc.DownloadDataTaskAsync(video).Result;
                if (dlVideo.Length > 1)
                {
                    dlVideo[0] = dlVideo[1] = 0;
                }
                File.WriteAllBytes(videoInput, dlVideo);

                overallProgress.Next("Overall Progress");
            }
            //wc.DownloadFile(video, Path.Combine(tempPath, videoInput));
            if (!args.gif && audio != null)
            {
                currentType = CoubDownloadType.Audio;
                withPercentage = new ProgressBar(PbStyle.SingleLine, 100, 20, '█');
                wc.DownloadFileTaskAsync(audio, Path.Combine(tempPath, audioInput)).Wait();
                wc.Dispose();
                overallProgress.Next("Overall Progress");
            }
            var ffmpeg = new Engine(this.ffmpegPath);
            if (args.audio == true)
            {
                if (audio == null)
                {
                    return "Audio does not exist or it has been removed from the specified coub";
                }
                if (File.Exists(resultOutputAudio))
                {
                    File.Delete(resultOutputAudio);
                }
                File.Move(audioInput, resultOutputAudio);

                if (App.Config.copyFileToClipboard)
                {
                    System.Windows.Forms.Clipboard.SetText(resultOutputAudio);
                }
                if (args.sharex || App.Config.Sharex.Enabled && File.Exists(App.Config.Sharex.Path))
                {
                    this.RunSharex(resultOutputAudio, args);
                }
                return resultOutputAudio;
            }
            withPercentage = new ProgressBar(PbStyle.SingleLine, 100, 20, '█');
            withPercentage.Refresh(0, "Converting");
            ffmpeg.Progress += (s, e) =>
            {
                var perc = Math.Round((e.TotalDuration.TotalMilliseconds / e.ProcessedDuration.TotalMilliseconds) * 100, 0);
                withPercentage.Refresh((int)perc, "Converting");
            };
            ffmpeg.Complete += (s, e) =>
            {
                withPercentage.Refresh(withPercentage.Max, "Converting");
            };
            if (args.gif)
            {
                overallProgress.Max = 2;
                var genMode = App.Config.useSinglePalletePerFrame ? "single" : "full";
                var genWidth = App.Config.gifWidth > 50 && App.Config.gifWidth < 500 ? App.Config.gifWidth : 320;
                ffmpeg.ExecuteAsync($"-y -i \"{videoInput}\" -filter_complex \"[0:v] scale=w={genWidth}:h=-1,split [a][b];[a] palettegen=stats_mode={genMode} [p];[b][p] paletteuse=new=1\" \"{resultGif}\"").Wait();
                if (App.Config.AdditionalGIFConversions?.Count > 0)
                {
                    string currentConvert = "Additional GIF Converts";
                    withPercentage = new ProgressBar(PbStyle.SingleLine, 100, currentConvert.Length, '█');
                    withPercentage.Refresh(0, currentConvert);
                    try
                    {
                        var tasks = App.Config.AdditionalGIFConversions.Select((x, i) =>
                        {
                            var tasksDone = 0;
                            var xHeight = x.Height != null ? x.Height : -1;
                            var xWidth = x.Width != null ? x.Width : (xHeight == -1 ? 100 : -1);
                            if (x.Height == null && x.Width == null)
                            {
                                throw new Exception("Error, Additional Gif Converter needs atleast 1 dimension");
                            }
                            var additionalOutputPath = Path.Combine(outputPath, $"{resultOutputPrefix}{CoubId} ({(xHeight == -1 ? "auto" : xHeight.ToString())}x{(x.MatchAspectRatio ? "auto" : xWidth.ToString())}).gif");
                            return ffmpeg.ExecuteAsync($"-y -i \"{videoInput}\" -filter_complex \"[0:v] scale=w={(x.MatchAspectRatio ? -1 : xWidth)}:h={(x.MatchAspectRatio ? -1 : xHeight)},{(x.Fps != null ? $"fps={x.Fps}," : "")}split [a][b];[a] palettegen=stats_mode={genMode} [p];[b][p] paletteuse=new=1\" \"{additionalOutputPath}\"").ContinueWith(r =>
                            {
                                withPercentage.Refresh(++tasksDone / App.Config.AdditionalGIFConversions.Count, currentConvert);
                            });
                        });
                        Task.WaitAll(tasks.ToArray());
                        withPercentage.Refresh(withPercentage.Max, currentConvert);
                    }
                    catch (Exception ex)
                    {
                        if (Debugger.IsAttached)
                        {
                            throw ex;
                        }
                        return ex.Message;
                    }
                }
                try
                {
                    File.Delete(videoInput);
                    File.Delete(audioInput);
                    System.Windows.Forms.Clipboard.SetText(resultGif);
                }
                catch { }
                overallProgress.Next("Overall Progress");
                if (!App.Config.silentWebProcessing)
                {
                    Task.Delay(1500).Wait();
                }
                if (args.sharex || App.Config.Sharex.Enabled && File.Exists(App.Config.Sharex.Path))
                {
                    this.RunSharex(resultGif, args);
                }
                return resultGif;
            }
            if (audio != null && (args.full == true || App.Config.spanVideoToAudio == true && !startedFromBrowser))
            {
                var vid = new MediaFile(videoInput);
                var aud = new MediaFile(audioInput);
                var audioDuration = ffmpeg.GetMetaDataAsync(aud).Result?.Duration;
                var videoDuration = ffmpeg.GetMetaDataAsync(vid).Result?.Duration;
                if (audioDuration.HasValue && videoDuration.HasValue && audioDuration.Value.TotalMilliseconds/1.5 < videoDuration.Value.TotalMilliseconds)
                {
                    Console.WriteLine($"Unable to loop video, audio is shorter than video.");
                    Task.Delay(5000).Wait();
                }
                else
                {
                    ffmpeg.ExecuteAsync($"-stream_loop -1 -i \"{videoInput}\" -i {audioInput} -c:v copy -shortest -map 0:v:0 -map 1:a:0 -y \"{resultOutput}\"").Wait();
                }
            }
            else if (audio != null)
            {
                ffmpeg.ExecuteAsync($"-i \"{videoInput}\" -i {audioInput} -c:v copy -c:a aac -shortest \"{resultOutput}\"").Wait();
            }
            else
            {
                ffmpeg.ExecuteAsync($"-i \"{videoInput}\" -codec copy -shortest \"{resultOutput}\"").Wait();
            }
            Console.SetCursorPosition(0, Console.CursorTop + 1);
            try
            {
                @File.Delete(videoInput);
                @File.Delete(audioInput);
            }
            catch { }
            overallProgress.Next("Overall Progress");
            if (File.Exists(resultOutput) && App.Config.copyFileToClipboard)
            {
                Dispatcher.CurrentDispatcher.Invoke(() =>
                {
                    @System.Windows.Forms.Clipboard.SetText(resultOutput);
                });
            }
            if (args.sharex || App.Config.Sharex.Enabled && File.Exists(App.Config.Sharex.Path))
            {
                this.RunSharex(resultOutput, args);
            }
            if (!App.Config.silentWebProcessing)
            {
                Task.Delay(1500).Wait();
            }
            return resultOutput;
        }
        private Task RunSharex(string file, DownloadArgs dArgs)
        {
            if (!File.Exists(file))
            {
                throw new FileNotFoundException("File does not Exist");
            }
            if (!File.Exists(App.Config.Sharex.Path))
            {
                throw new FileNotFoundException("Sharex could not be found");
            }
            var args = new List<string>() { $"\"{file}\"" };
            if (dArgs.sharexTask != null || App.Config.Sharex.TaskName != null)
            {
                args.Add($"-task \"{ (dArgs.sharexTask != null ? dArgs.sharexTask : App.Config.Sharex.TaskName) }\"");
            }
            args.Add("-s");
            return Task.Run((Action)(() =>
              {
                  var p = new Process()
                  {
                      StartInfo = new ProcessStartInfo()
                      {
                          FileName = App.Config.Sharex.Path,
                          Arguments = string.Join(" ", args)
                      }
                  };
                  p.Start();
              }));
        }
    }
    enum CoubDownloadType
    {
        Audio,
        Video
    }
}