using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoubDownload_Bridge.Utils
{
    public static class StringExtension
    {
        public static string ReplaceVariables(this string replaceable, Tuple<string, string>[] vars)
        {
            vars.ToList().ForEach(x =>
            {
                replaceable = string.Join(x.Item2, replaceable.Split(new string[] { $"%{x.Item1}%" }, StringSplitOptions.None));
            });
            return replaceable;
        }
        public static string SanitizeFilename(this string filename)
        {
            return String.Concat(filename.Split(Path.GetInvalidFileNameChars()));
        }
    }
}
