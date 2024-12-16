<?php

namespace Marvel\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactAdmin extends Mailable
{
    use Queueable, SerializesModels;

    public $details;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($details)
    {
        $this->details = $details;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from(config('mail.from.address'), config('mail.from.name')) // Use MAIL_FROM_ADDRESS
        ->replyTo($this->details['email']) // Set user's email as reply-to
        ->subject($this->details['subject']) // Email subject
        ->markdown('emails.contact-admin') // View file
        ->with('details', $this->details); // Pass data to the view     
    }
}
