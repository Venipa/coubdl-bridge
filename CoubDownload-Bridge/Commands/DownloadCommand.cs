﻿using Consolas.Core;
using CoubDownload_Bridge.API;
using CoubDownload_Bridge.Args;
using FFmpeg.NET;
using MyDownloader.Core;
using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CoubDownload_Bridge.Commands
{
    public class DownloadCommand : Command
    {
        public string CoubId { get; private set; }
        private string currentPath { get => AppDomain.CurrentDomain.BaseDirectory; }
        private string tempPath { get => Path.Combine(this.currentPath, "tmp"); }
        private string outputPath { get => Path.Combine(this.currentPath, "output"); }
        private string ffmpegPath { get => Path.Combine(this.currentPath, "FFMPEG", "ffmpeg.exe"); }
        public string Execute(DownloadArgs args)
        {
            if (args.download.Length == 0)
            {
                return "Invalid ID";
            }
            string CoubId = args.download;
            if (CoubId.ToLower().StartsWith("coubdl-bridge"))
            {
                CoubId = CoubId.Substring("coubdl-bridge://".Length);
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
            Debug.WriteLine(this.ffmpegPath);
            var cl = new Coub();
            var data = cl.getCoubById(CoubId).Result;
            var audio = data.FileVersions.Html5.Audio.High?.Url ?? data.FileVersions.Html5.Audio.Med.Url;
            var video = data.FileVersions.Html5.Video.High?.Url ?? data.FileVersions.Html5.Video.Med.Url;
            var wc = new WebClient();
            var videoInput = Path.Combine(tempPath, $"video_{data.Id}.temp");
            var audioInput = Path.Combine(tempPath, $"audio_{data.Id}.temp");
            var resultOutput = Path.Combine(outputPath, $"{CoubId}.mp4");
            var dlVideo = wc.DownloadData(video);
            if (dlVideo.Length > 1)
            {
                dlVideo[0] = dlVideo[1] = 0;
            }
            File.WriteAllBytes(videoInput, dlVideo);
            //wc.DownloadFile(video, Path.Combine(tempPath, videoInput));
            wc.DownloadFile(audio, Path.Combine(tempPath, audioInput));
            var ffmpeg = new Engine(this.ffmpegPath);
            if (!Directory.Exists(this.outputPath))
            {
                Directory.CreateDirectory(this.outputPath);
            }
            if (!Directory.Exists(this.tempPath))
            {
                Directory.CreateDirectory(this.tempPath);
            }
            ffmpeg.ExecuteAsync($"-i \"{videoInput}\" -i {audioInput} -codec copy -shortest \"{resultOutput}\"").Wait();
            return resultOutput;
            return new HelpCommand().Execute(new HelpArgs { Help = true });
        }
    }
}