using FicticiaSA.Data;
using FicticiaSA.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Runtime.Intrinsics.X86;

namespace FicticiaSA.Controllers
{

    [Authorize(Roles = "ADMIN")]

    public class ClientesController : Controller
    {

        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        public ClientesController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }


        public IActionResult Index()
        {
            return View();
        }



        public JsonResult BuscarClientes(string Buscar, int ClienteID = 0, int EstadoID = 0)
        {
            List<VistaCliente> listadoclientes = new List<VistaCliente>();


            var clientes = _context.Clientes.ToList();

            if (EstadoID == 1)
            {
                clientes = clientes.Where(c => c.Estado == EstadoCliente.ACTIVO).ToList();
            }
            else if (EstadoID == 2)
            {
                clientes = clientes.Where(c => c.Estado == EstadoCliente.INACTIVO).ToList();
            }


            if (!string.IsNullOrEmpty(Buscar))
            {

                Buscar = Buscar.ToUpper();

                clientes = clientes.Where(c => c.NombreCompleto.Contains(Buscar) || c.DNI.Contains(Buscar)).ToList();
            }


            if (ClienteID > 0)
            {
                clientes = clientes.Where(c => c.ClienteID == ClienteID).ToList();
            }

            if (!clientes.Any())
            {
                return Json(new { mensaje = "No se encontró ningún cliente." });
            }


            foreach (var cliente in clientes.OrderBy(c => c.Estado == EstadoCliente.INACTIVO).ThenBy(c => c.NombreCompleto))
            {

                var mostrarCliente = new VistaCliente
                {
                    ClienteID = cliente.ClienteID,
                    NombreCompleto = cliente.NombreCompleto,
                    DNI = cliente.DNI,
                    Edad = cliente.Edad, 
                    Genero = cliente.Genero,
                    GeneroNombre = cliente.GeneroNombre,
                    Estado = cliente.Estado,
                    EstadoNombre = cliente.EstadoNombre,
                    Maneja = cliente.Maneja,
                    Fuma = cliente.Fuma, 
                    Diabetes = cliente.Diabetes,
                    UsaLentes = cliente.UsaLentes,
                    Enfermedad = cliente.Enfermedad,
                    TipoEnfermedad = cliente.TipoEnfermedad                 

                };

                listadoclientes.Add(mostrarCliente);
            }



            return Json(listadoclientes);
        }



        public JsonResult GuardarCliente(int ClienteID, string NombreCompleto, string DNI, int Edad, GeneroCliente Genero, EstadoCliente Estado, bool Maneja, bool Fuma, bool UsaLentes, bool Diabetes, bool Enfermedad, string TipoEnfermedad)
        {
            int resultado = 0;

            if (ClienteID == 0)
            {
                if (_context.Clientes.Any(c => c.DNI == DNI))
                {
                    resultado = 1;
                }
                else
                {

                    var nuevoCliente = new Cliente
                    {
                        NombreCompleto = NombreCompleto.ToUpper(),
                        DNI = DNI,
                        Edad = Edad,
                        Genero = Genero,
                        Estado = Estado,
                        Maneja = Maneja,
                        Fuma = Fuma,
                        UsaLentes = UsaLentes,
                        Diabetes = Diabetes,
                        Enfermedad = Enfermedad,
                        TipoEnfermedad = TipoEnfermedad

                    };
                    _context.Add(nuevoCliente);
                    _context.SaveChanges();
                }

            }
            else
            {
                if (_context.Clientes.Any(c => c.DNI == DNI && c.ClienteID != ClienteID))
                {
                    resultado = 1;
                }
                else
                {
                    var cliente = _context.Clientes.Single(p => p.ClienteID == ClienteID);

                    if (cliente != null)
                    {

                        cliente.NombreCompleto = NombreCompleto.ToUpper();
                        cliente.DNI = DNI;
                        cliente.Edad = Edad;
                        cliente.Genero = Genero;
                        cliente.Estado = Estado;
                        cliente.Maneja = Maneja;
                        cliente.Fuma = Fuma;
                        cliente.UsaLentes = UsaLentes;
                        cliente.Diabetes = Diabetes;
                        cliente.Enfermedad = Enfermedad;
                        cliente.TipoEnfermedad = TipoEnfermedad;

                        _context.SaveChanges();
                    }

                }

            }


            return Json(resultado);
        }



        public JsonResult EstadoDelCliente(int ClienteID)
        {
            bool resultado = false;


            var cliente = _context.Clientes.Find(ClienteID);

            if (cliente != null)
            {

                if (cliente.Estado == EstadoCliente.ACTIVO)
                {
                    cliente.Estado = EstadoCliente.INACTIVO;
                    _context.SaveChanges();


                }
                else
                {
                    cliente.Estado = EstadoCliente.ACTIVO;
                    _context.SaveChanges();
                }

                resultado = true;
            }

            return Json(resultado);
        }




        public JsonResult EliminarCliente(int ClienteID)
        {
            bool resultado = false;
            string mensaje = "No se pudo completar la eliminación del cliente.";


            var cliente = _context.Clientes.Find(ClienteID);

            if (cliente != null)
            {
                _context.Clientes.Remove(cliente);
                _context.SaveChanges();
                resultado = true;

                mensaje = "El cliente fue eliminado con éxito.";
            }


            return Json(new { resultado, mensaje });
        }




    }
}
