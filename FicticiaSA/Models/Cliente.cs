using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FicticiaSA.Models
{
    public class Cliente
    {
        [Key]
        public int ClienteID { get; set; }

        public string NombreCompleto { get; set; }

        public string DNI { get; set; }

        public int Edad { get; set; }

        public GeneroCliente Genero {  get; set; }


        [NotMapped]
        public string GeneroNombre { get { return Genero.ToString(); } }


        public EstadoCliente Estado { get; set; }

        [NotMapped]
        public string EstadoNombre { get { return Estado.ToString(); } }


        //--------- ATRIBUTOS ADICIONALES -----------

        public bool Maneja { get; set; }

        public bool Fuma { get; set; }

        public bool UsaLentes { get; set; }

        public bool Diabetes { get; set; }



        public bool Enfermedad { get; set; }

        public string? TipoEnfermedad { get; set; }



    }





    public enum EstadoCliente
    {
        ACTIVO = 1,
        INACTIVO
    }

    public enum GeneroCliente
    {
        HOMBRE = 1,
        MUJER,
        NOBINARIO,
        OTRO,
        NODECIR
    }


    public class VistaCliente
    {

        public int ClienteID { get; set; }

        public string? NombreCompleto { get; set; }

        public string? DNI { get; set; }

        public int Edad { get; set; }

        public GeneroCliente Genero { get; set; }

        public string? GeneroNombre { get; set; }

        public EstadoCliente Estado { get; set; }

        public string? EstadoNombre { get; set; }

        public bool Maneja { get; set; }

        public bool Fuma { get; set; }

        public bool UsaLentes { get; set; }

        public bool Diabetes { get; set; }

        public bool Enfermedad { get; set; }

        public string? TipoEnfermedad { get; set; }

    }

}
