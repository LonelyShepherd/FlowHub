using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FlowHub.Models;

namespace FlowHub.ViewModels
{
	public class DashboardViewModel<T>
	{
		public DashboardViewModel(T Model)
		{
			this.Model = Model;
		}

		public T Model { get; }
	}

	public class DashboardViewModel<T1, T2> : DashboardViewModel<T2>
	{
		public DashboardViewModel(T1 VModel, T2 LModel): base (LModel)
		{
			this.VModel = VModel;
		}

		public T1 VModel { get;  }
		
	}
}