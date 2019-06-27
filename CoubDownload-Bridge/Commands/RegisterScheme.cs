using Consolas.Core;
using CoubDownload_Bridge.Args;
using Microsoft.Win32;
using System;
using System.Diagnostics;
using System.IO;

namespace CoubDownload_Bridge.Commands
{
    public class RegisterSchemeArgs
    {
        public bool register { get; set; }
    }
    public class RegisterSchemeCommand : Command
    {
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
        public string Execute(RegisterSchemeArgs args)
        {
            if (args.register == true)
            {
                this.RegisterMyProtocol(System.Reflection.Assembly.GetEntryAssembly().Location);
            } else
            {
                try
                {
                    Registry.ClassesRoot.DeleteSubKey("CoubDL-Bridge");
                } catch { }
            }
            return "Using: CoubDownload_Bridge.exe ...";
        }
    }
}