using Microsoft.AspNetCore.Mvc;

namespace KMU.HisOrder.MVC.Areas.Statistic.Controllers
{
    public class TotalMonthlyController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
