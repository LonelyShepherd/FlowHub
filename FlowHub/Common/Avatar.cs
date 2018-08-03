using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace FlowHub.Common
{
	public static class Avatar
	{
		static public string Upload(HttpPostedFileBase Image)
		{
			if (Image == null) return null;

			var type = Image.ContentType;
			var pattern = @"(jpeg|png|tiff)$";
			if (!Regex.IsMatch(type, pattern))
				return null;

			Console.Write("OKE");
			var extension = Path.GetExtension(Image.FileName);
			var fileName = String.Join("", 
				Guid.NewGuid()
				.ToString()
				.Split(new char[] { '-' }, StringSplitOptions.None));
			fileName = fileName + extension;
			var path = Path.Combine(System.Web.HttpContext.Current.Server.MapPath("~/Avatars/"), fileName);

			Image.SaveAs(path);

			if(File.Exists(path))
			{
				CreateThumbnail(path, 200, 200);
				return fileName;
			}

			return null;
		}

		static private void CreateThumbnail(string fileName, int width, int height) 
		{
			Bitmap thumbnail = null;
			Bitmap original = null;

			try
			{
				original = new Bitmap(fileName);
				ImageFormat originalFormat = original.RawFormat;

				if (original.Width < width && original.Height < height)
				{
					thumbnail.Save(fileName);
					return;
				}

				decimal ratio;
				int newWidth = 0;
				int newHeight = 0;

				if (original.Width > original.Height)
				{
					ratio = (decimal)width / original.Width;
					newWidth = width;
					decimal temp = original.Height * ratio;
					newHeight = (int)temp;
				}
				else
				{
					ratio = (decimal)height / original.Height;
					newHeight = height;
					decimal temp = original.Width * ratio;
					newWidth = (int)temp;
				}

				thumbnail = new Bitmap(newWidth, newHeight);
				Graphics g = Graphics.FromImage(thumbnail);

				g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
				g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
				g.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
				g.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
				g.FillRectangle(Brushes.White, 0, 0, newWidth, newHeight);
				g.DrawImage(original, 0, 0, newWidth, newHeight);
			}
			catch { }
			finally
			{
				if(original != null)
					original.Dispose();
			}

			thumbnail.Save(fileName);
		}
	}
}