using Consolas.Core;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoubDownload_Bridge
{
    public static class App
    {
        public static Config Config { get; set; }
    }
    class Program : ConsoleApp<Program>
    {

        private string currentPath { get => AppDomain.CurrentDomain.BaseDirectory; }
        private string tempPath { get => Path.Combine(this.currentPath, "tmp"); }
        static void Main(string[] args)
        {
            var config = new Config();
            if (!config.Exists())
            {
                config.Save();
            } else
            {
                config.Load();
            }
            App.Config = config;
            var prg = new Program();
            prg.createPrerequisites(args);
            Match(args);
        }
        void createPrerequisites(string[] args)
        {
            Debug.WriteLine(this.currentPath);
            Debug.WriteLine(string.Join(";", args));
            if (!Directory.Exists(this.tempPath))
            {
                Directory.CreateDirectory(this.tempPath);
            }
        }
    }
}
