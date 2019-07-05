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

namespace CoubDownload_Bridge.Commands
{
    public class DownloadCommand : Command
    {
        public string CoubId { get; private set; }
        private string currentPath { get => AppDomain.CurrentDomain.BaseDirectory; }
        private string tempPath { get => Path.Combine(this.currentPath, "tmp"); }
        private string outputPath { get => App.Config.outputPath; }
        private string ffmpegPath { get => Path.Combine(this.currentPath, "FFMPEG", "ffmpeg.exe"); }
        public string Execute(DownloadArgs args)
        {
            if (App.Config.silentWebProcessing)
            {
                Task.Run((async () => {
                    return new DownloadCommand().Execute(args);
                }));
                return "async processing...";
            }
            if (args.download.Length == 0)
            {
                return "Invalid ID";
            }
            string CoubId = args.download;
            if (CoubId.ToLower().StartsWith("coubdl-bridge"))
            {
                CoubId = CoubId.Substring("coubdl-bridge://".Length);
                var csId = CoubId.Split('/');
                if (csId.Length > 1)
                {
                    CoubId = csId.FirstOrDefault();
                    if (csId.LastOrDefault() == "audio")
                    {
                        args.audio = true;
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
            if (!Directory.Exists(this.outputPath))
            {
                Directory.CreateDirectory(this.outputPath);
            }
            if (!Directory.Exists(this.tempPath))
            {
                Directory.CreateDirectory(this.tempPath);
            }
            Debug.WriteLine(this.ffmpegPath);
            var cl = new Coub();
            var data = cl.getCoubById(CoubId).Result;
            var audio = data.FileVersions.Html5.Audio.High?.Url ?? data.FileVersions.Html5.Audio.Med.Url;
            var video = data.FileVersions.Html5.Video.High?.Url ?? data.FileVersions.Html5.Video.Med.Url;
            var wc = new WebClient();
            var videoInput = Path.Combine(tempPath, $"video_{data.Id}-({Guid.NewGuid().ToString()}).temp");
            var audioInput = Path.Combine(tempPath, $"audio_{data.Id}-({Guid.NewGuid().ToString()}).temp");
            var resultOutput = Path.Combine(outputPath, $"{CoubId}.mp4");
            var resultOutputAudio = Path.Combine(outputPath, $"{CoubId}.mp3");

            Console.WriteLine();

            var withPercentage = new ProgressBar(PbStyle.SingleLine, 100, 16, '█');
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
            }
            //wc.DownloadFile(video, Path.Combine(tempPath, videoInput));
            currentType = CoubDownloadType.Audio;
            wc.DownloadFileTaskAsync(audio, Path.Combine(tempPath, audioInput)).Wait();
            wc.Dispose();
            var ffmpeg = new Engine(this.ffmpegPath);
            if (args.audio == true)
            {
                if (File.Exists(resultOutputAudio))
                {
                    File.Delete(resultOutputAudio);
                }
                File.Move(audioInput, resultOutputAudio);

                if (App.Config.copyFileToClipboard)
                {
                    System.Windows.Forms.Clipboard.SetText(resultOutputAudio);
                }
                return resultOutputAudio;
            }
            withPercentage = new ProgressBar(PbStyle.SingleLine, 100, 16, '█');
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
            if (App.Config.spanVideoToAudio || args.full == true)
            {
                var vid = new MediaFile(videoInput);
                var aud = new MediaFile(audioInput);
                if (vid.FileInfo.Length >= aud.FileInfo.Length)
                {
                    ffmpeg.ExecuteAsync($"-i \"{videoInput}\" -stream_loop -1 -i {audioInput} -c:v copy -shortest -map 0:v:0 -map 1:a:0 -y \"{resultOutput}\"").Wait();
                } else
                {
                    ffmpeg.ExecuteAsync($"-stream_loop -1 -i \"{videoInput}\" -i {audioInput} -c:v copy -shortest -map 0:v:0 -map 1:a:0 -y \"{resultOutput}\"").Wait();
                }
            } else
            {
                ffmpeg.ExecuteAsync($"-i \"{videoInput}\" -i {audioInput} -codec copy -shortest \"{resultOutput}\"").Wait();
            }
            Console.SetCursorPosition(0, Console.CursorTop + 1);
            try
            {
                File.Delete(videoInput);
                File.Delete(audioInput);
            } catch { }
            if(App.Config.copyFileToClipboard)
            {
                System.Windows.Forms.Clipboard.SetText(resultOutput);
            }
            return resultOutput;
        }
    }
    enum CoubDownloadType
    {
        Audio,
        Video
    }
}