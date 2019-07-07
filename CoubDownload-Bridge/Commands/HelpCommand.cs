using Consolas.Core;
using CoubDownload_Bridge.Args;
using System.IO;
using System.Reflection;

namespace CoubDownload_Bridge.Commands
{
    public class HelpCommand : Command
    {
        public object Execute(HelpArgs args)
        {
            return View("Default", new
            {
                version = Assembly.GetExecutingAssembly().GetName().Version.ToString(),
                executable = Path.GetFileName(Assembly.GetExecutingAssembly().Location)
            });
        }
    }
}