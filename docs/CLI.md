> Regarding `Window OS` we recommend using [cmder](https://cmder.net/)
### Installation
```bash
npm i -g olum-cli
```

### Create a project
```bash
olum create project-name
```

### Run development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Hint
> After building your app for deployment you will be asked </br>
`Do you want to catch all routes to fallback to root ?`</br>
If you typed `yes` then you will need to add the desired routes separated by comma `e.g. about, contact, faq`</br>
This option is for single page apps that use a host which supports only front-end technologies

> Now you can export desktop app by following the cli questions