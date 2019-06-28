using Consolas.Core;
using CoubDownload_Bridge.Args;
using Microsoft.Win32;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Security.Permissions;
using System.Security.Principal;

namespace CoubDownload_Bridge.Commands
{
    public class RegisterSchemeArgs
    {
        public bool register { get; set; }
    }
    public class RegisterSchemeCommand : Command
    {

        [DllImport("kernel32.dll")]
        static extern bool CreateSymbolicLink(
        string lpSymlinkFileName, string lpTargetFileName, SymbolicLink dwFlags);

        enum SymbolicLink
        {
            File = 0,
            Directory = 1
        }
        void RegisterMyProtocol(string myAppPath)  //myAppPath = full path to your application
        {
            RegistryKey key = Registry.ClassesRoot.OpenSubKey("CoubDL-Bride");  //open myApp protocol's subkey

            if (key == null)  //if the protocol is not registered yet...we register it
            {
                key = Registry.ClassesRoot.CreateSubKey("CoubDL-Bridge");
                key.SetValue(string.Empty, "URL: CoubDL Protocol");
                key.SetValue("URL Protocol", string.Empty);

                key = key.CreateSubKey(@"shell\open\command");
                key.SetValue(string.Empty, myAppPath + " -download " + "%1");
                //%1 represents the argument - this tells windows to open this program with an argument / parameter
            }

            key.Close();
        }
        public static bool IsAdministrator()
        {
            using (WindowsIdentity identity = WindowsIdentity.GetCurrent())
            {
                WindowsPrincipal principal = new WindowsPrincipal(identity);
                return principal.IsInRole(WindowsBuiltInRole.Administrator);
            }
        }
        public string Execute(RegisterSchemeArgs args)
        {
            var appLocation = System.Reflection.Assembly.GetEntryAssembly().Location;
            var shortcutApp = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "coub-bridge.exe");
            if (args.register == true)
            {
                if (!RegisterSchemeCommand.IsAdministrator())
                {
                    var processInfo = new ProcessStartInfo(appLocation, "-register")
                    {
                        Verb = "runas",
                        CreateNoWindow = true,
                        WindowStyle = ProcessWindowStyle.Hidden
                    };
                    var prc = new Process()
                    {
                        StartInfo = processInfo,
                        EnableRaisingEvents = true
                    };
                    prc.Start();
                    prc.OutputDataReceived += (s, e) =>
                    {
                        Console.WriteLine(e.Data);
                    };
                    prc.WaitForExit();
                    return "Registering URL Scheme...\n" +
                        "Creating Shortcut Scheme...\n" +
                        "Use coub-bridge -download <id>, once path has been registered...\n" +
                        "Setting Path Register...";
                }
                Console.WriteLine("Registering URL Scheme...");
                this.RegisterMyProtocol(appLocation);
                if (!File.Exists(shortcutApp))
                {
                    Console.WriteLine("Creating Shortcut Scheme...");
                    Console.WriteLine("Use coub-bridge -download <id>, once path has been registered...");
                    RegisterSchemeCommand.CreateSymbolicLink(shortcutApp, appLocation, SymbolicLink.File);
                }
                string pathvar = Environment.GetEnvironmentVariable("PATH", EnvironmentVariableTarget.Machine);
                if (pathvar.Split(';').Where(x => x.ToLower().EndsWith(AppDomain.CurrentDomain.BaseDirectory)).Count() == 0)
                {
                    Console.WriteLine("Setting Path Register...");
                    Environment.SetEnvironmentVariable("PATH", $"{pathvar};{AppDomain.CurrentDomain.BaseDirectory}", EnvironmentVariableTarget.Machine);
                }
            }
            else
            {
                if (!RegisterSchemeCommand.IsAdministrator())
                {
                    var processInfo = new ProcessStartInfo(appLocation, "-register false")
                    {
                        Verb = "runas",
                        CreateNoWindow = true,
                        WindowStyle = ProcessWindowStyle.Hidden
                    };
                    var prc = new Process()
                    {
                        StartInfo = processInfo,
                        EnableRaisingEvents = true
                    };
                    prc.Start();
                    prc.OutputDataReceived += (s, e) =>
                    {
                        Console.WriteLine(e.Data);
                    };
                    prc.WaitForExit();
                    return "Removing Shortcut Register...\n" +
                        "Removing Path Register...\n" +
                        "Removing URL Scheme Register...";
                }
                try
                {
                    Console.WriteLine("Removing Shortcut Register...");
                    File.Delete(shortcutApp);
                    string pathvar = Environment.GetEnvironmentVariable("PATH", EnvironmentVariableTarget.Machine);
                    var path = pathvar.Split(';');
                    if (path.Where(x => x.ToLower().EndsWith(AppDomain.CurrentDomain.BaseDirectory)).Count() > 0)
                    {
                        Console.WriteLine("Removing Path Register...");
                        var parsedPath = string.Join(";", path.Where(x => !x.ToLower().EndsWith(AppDomain.CurrentDomain.BaseDirectory)));
                        if (parsedPath.EndsWith(";"))
                        {
                            parsedPath = parsedPath.Substring(0, parsedPath.Length - 1);
                        }
                        Environment.SetEnvironmentVariable("PATH", parsedPath);
                    }
                    Console.WriteLine("Removing URL Scheme Register...");
                    Registry.ClassesRoot.DeleteSubKey("CoubDL-Bridge");
                }
                catch { }
            }
            return "Using: CoubDownload_Bridge.exe ...";
        }
    }
}