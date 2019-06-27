using Consolas.Core;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoubDownload_Bridge
{
    class Program : ConsoleApp<Program>
    {

        private string currentPath { get => AppDomain.CurrentDomain.BaseDirectory; }
        private string tempPath { get => Path.Combine(this.currentPath, "tmp"); }
        static void Main(string[] args)
        {
            var prg = new Program();
            prg.createPrerequisites(args);
            Match(args);
        }
        void createPrerequisites(string[] args)
        {
            Console.WriteLine(this.currentPath);
            Console.WriteLine(string.Join(";", args));
            if (!Directory.Exists(this.tempPath))
            {
                Directory.CreateDirectory(this.tempPath);
            }
        }
    }
}
