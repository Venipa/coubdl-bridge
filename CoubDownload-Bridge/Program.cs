using Consolas.Core;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
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
        const Int32 SW_MINIMIZE = 6;

        [DllImport("Kernel32.dll", CallingConvention = CallingConvention.StdCall, SetLastError = true)]
        private static extern IntPtr GetConsoleWindow();

        [DllImport("User32.dll", CallingConvention = CallingConvention.StdCall, SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool ShowWindow([In] IntPtr hWnd, [In] int nCmdShow);

        private static void MinimizeConsoleWindow()
        {
            IntPtr hWndConsole = GetConsoleWindow();
            ShowWindow(hWndConsole, SW_MINIMIZE);
        }

        private string currentPath { get => AppDomain.CurrentDomain.BaseDirectory; }
        private string tempPath { get => Path.Combine(this.currentPath, "tmp"); }
        [STAThread]
        static void Main(string[] args)
        {

            Console.Title = Assembly.GetExecutingAssembly().GetName().Name;
            var config = new Config();
            if (!config.Exists())
            {
                config.Save();
            } else
            {
                config.Load();
            }
            if (config.silentWebProcessing)
            {
                Console.WindowTop = 0;
                Console.WindowLeft = 0;
                Console.WindowHeight = 26;
                Console.WindowWidth = 40;
                MinimizeConsoleWindow();
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
