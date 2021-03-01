miro.onReady(() => {
  const icon24 =
    '<g id="Layer_1"><path d="M2.796,2.468 L2.749,22.468" fill-opacity="0" stroke="#000000" stroke-width="2"/><path d="M3.5,21.5 L23.564,21.5" fill-opacity="0" stroke="#000000" stroke-width="2"/><path d="M2.796,14.783 C3.209,13.972 3.594,13.171 4.059,12.371 C4.623,11.401 5.385,10.556 5.953,9.606 C6.402,8.857 7.01,8.19 7.426,7.395 C7.433,7.382 7.577,7.143 7.584,7.143 C7.752,7.143 8.14,9.507 8.163,9.606 C8.417,10.699 9.623,17.334 10.268,17.95 C10.54,18.21 10.69,17.331 10.846,16.995 C11.092,16.467 11.363,15.957 11.636,15.437 C12.745,13.317 13.466,11.153 14.687,9.053 C15.97,6.848 15.997,5.125 18.107,8.148 C18.173,8.244 19.421,9.809 19.475,9.757 C20.284,8.984 20.992,7.211 21.527,6.188" fill-opacity="0" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>'
  
    const d4icon = `<svg width="64" height="64" version="1.1" viewBox="0 0 16.933 16.933" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
   <path id="p7" d="m28.07 130.5c3.05 3.83 5.42 8.17 8.25 12.17 3.74 5.83 7.76 11.48 11.39 17.38-5.34 2.9-10.63 5.97-16.1 8.61-1.22.72-2.61-.07-3.83-.43-7.62-3.05-15.31-5.93-23-8.83 1.22-1.95 2.53-3.83 4.03-5.57 6.48-7.71 12.6-15.77 19.26-23.33zm-2.89 5.73c-6.14 7.35-12.03 14.9-18.14 22.27 7.54 2.99 15.14 5.84 22.71 8.74-.89-11.19-1.45-22.41-2.45-33.59-.71.86-1.41 1.72-2.12 2.58z"/>
   <path id="p13" d="m27.3 133.65c1 11.18 1.56 22.4 2.45 33.59-7.57-2.9-15.17-5.75-22.71-8.74 6.11-7.37 12-14.92 18.14-22.27.71-.86 1.41-1.72 2.12-2.58z"/>
  </defs>
  <use transform="matrix(.35278 0 0 .35278 -.86821 -44.392)" width="100%" height="100%" fill="#333333" xlink:href="#p7"/>
  <use transform="matrix(.35278 0 0 .35278 -.86821 -44.392)" width="100%" height="100%" fill="#e6e6e6" xlink:href="#p13"/>
 </svg>`

  miro.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'widget counter',
        svgIcon: icon24,
        onClick: () => {
          miro.board.ui.openLeftSidebar('sidebar.html')
        },
      },
      bottomBar: {
        title: 'Demo app button',
        svgIcon: d4icon,
        onClick: () => {
          alert('Bottom bar item has been clicked')
        }
      },
    },
  })
})
