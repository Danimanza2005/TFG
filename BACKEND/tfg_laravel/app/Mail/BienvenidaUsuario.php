<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BienvenidaUsuario extends Mailable
{
    use Queueable, SerializesModels;

    public $nombre; //Variable para almacenar el nombre del usuario

    public function __construct($nombre)
    {
        $this->nombre = $nombre;
    }
    public function build()
    {
        return $this->subject('¡Registro completado con éxito!')
            ->from('futbolbarro513@gmail.com', 'Fútbol Barro')
            ->withSwiftMessage(function ($message) {
                $message->getHeaders()->addTextHeader('X-Non-Spam', 'Yes');
            })
            ->html(
                "
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #1f1f1f;'>
        <p style='font-size: 22px; font-weight: bold;'>¡Bienvenido, <strong>{$this->nombre}</strong>! 🎉</p>

        <p style='font-size: 16px; line-height: 1.5;'>
            Ya formas parte de <strong>FutbolBarro</strong>, donde el fútbol se juega con alma, risas y... mucho barro. 
            Prepárate para deslizarte, competir y vivir algo totalmente diferente. ⚽🌪️
        </p>

        <div style='text-align: center; margin: 25px 0;'>
            <a href='https://www.lapreferente.com/E4819/barro-cf' 
               style='display: inline-block; padding: 12px 24px; background-color: #ff5722; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;'>
                🌐 Conoce más
            </a>
        </div>

        <p style='text-align: center; font-style: italic; margin-top: 30px;'>Nos vemos en el barro. Danke! 🏆</p>
    </div>"
            );
    }
}
