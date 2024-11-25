using FicticiaSA.Data;
using FicticiaSA.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace FicticiaSA.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private ApplicationDbContext _context;
        private UserManager<IdentityUser> _userManager;
        private RoleManager<IdentityRole> _rolManager;


        public HomeController(ILogger<HomeController> logger, ApplicationDbContext context, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> rolManager)
        {
            _logger = logger;
            _context = context;
            _userManager = userManager;
            _rolManager = rolManager;
        }

        public async Task<IActionResult> Index()
        {

            await InicializarPermisos();


            string email = "admin@ficticia.com";
            string password = "Admin24";
            string rolNombre = "ADMIN";

            await RegistrarAdmin(email, password, rolNombre);

            return View();
        }



        public async Task<JsonResult> RegistrarAdmin(string Email, string Password, string RolNombre)
        {

            bool creado = false;

            var usuario = _context.Users.Where(u => u.Email == Email).SingleOrDefault();

            if (usuario == null)
            {
                var user = new IdentityUser { UserName = Email, Email = Email };
                var result = await _userManager.CreateAsync(user, Password);

                await _userManager.AddToRoleAsync(user, RolNombre);
                creado = result.Succeeded;
            }

            return Json(creado);

        }


        public async Task InicializarPermisos()
        {
            var rolExiste = await _rolManager.RoleExistsAsync("ADMIN");
            if (!rolExiste)
            {
                await _rolManager.CreateAsync(new IdentityRole("ADMIN"));
            }
        }


        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
