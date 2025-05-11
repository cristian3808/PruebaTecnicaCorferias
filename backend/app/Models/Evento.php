<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// Modelo Evento para interactuar con la base de datos
class Evento extends Model
{
    use HasFactory;
    // Campos de la tabla eventos
    protected $fillable = [
        'nombre', 'fecha_hora', 'ubicacion', 'boletos_disponibles', 'precio_boleto',
    ];
}
