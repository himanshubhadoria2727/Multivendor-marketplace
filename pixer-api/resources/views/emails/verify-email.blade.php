@component('mail::message')
# Website Verification Token for ```{{$emailDomain}}```

Please copy the below token to verify your website.

```{{$token}}```

Thanks,<br>
{{ config('app.name') }}
@endcomponent