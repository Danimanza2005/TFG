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
        return $this->subject('¡MUCHAS GRACIAS POR SU COMPRA! Eu farei 10x se for preciso. Eles não estão preparados.')
            ->from('futbolbarro513@gmail.com', 'Fútbol Barro')
            ->withSwiftMessage(function ($message) {
                $message->getHeaders()->addTextHeader('X-Non-Spam', 'Yes');
            })
            ->html("
                        <p style='font-size: 18px; font-weight: bold;'>¡Hola <strong>{$this->nombre}</strong>! 👋</p>
                        <p style='font-size: 16px; color: #444;'>Tu compra ha sido confirmada y estamos emocionados, te esperamos de vuelta.</p>
                        <p style='font-size: 18px; font-weight: bold; color: #d32f2f;'>Total de la compra: <strong>399.99€</strong> 💰</p>
                        <p>Gracias por confiar en nosotros. Prepárate para una experiencia única en el <strong>fútbol barro</strong>!</p>
                        <p style='text-align: center; margin-top: 20px;'>
                            <a href='https://www.lapreferente.com/E4819/barro-cf' 
                            style='display: inline-block; padding: 10px; background-color: #007bff; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px;'>
                            🔗 Visita nuestra web
                            </a>
                        </p>
                        <img src='https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/4625264868972a17a5d548c1d788af8d~tplv-tiktokx-cropcenter:1080:1080.jpeg?dr=10399&refresh_token=c5b40a6f&x-expires=1749729600&x-signature=fv4k7FlKNONApKaKhzoLdK0H3c8%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=no1a' style='width: 300px; height:300px;'>
                        <img src='https://static.nationalgeographic.es/files/styles/image_3200/public/1959_miss_baker_nasa.jpg?w=1600' style='width: 400px; height:300px;'>
                        <p style='margin-top: 30px; font-style: italic;'>Nos vemos en el barro, Danke! 🏆🌍</p>
                    ");
    }
}
