const https = require('https');
const fs = require('fs');
const path = require('path');

const logos = [
  { name: 'coca-cola.png', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/800px-Coca-Cola_logo.svg.png' },
  { name: 'pepsi.png', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Pepsi_logo_2014.svg/800px-Pepsi_logo_2014.svg.png' },
  { name: 'heineken.png', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Heineken_logo.svg/800px-Heineken_logo.svg.png' },
  { name: 'tiger.png', url: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Tiger_Beer_Logo.svg/800px-Tiger_Beer_Logo.svg.png' },
  { name: 'sabeco.png', url: 'https://sabeco.com.vn/Templates/sabeco/images/logo.png' },
  { name: 'abbott.png', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Abbott_Laboratories_logo.svg/800px-Abbott_Laboratories_logo.svg.png' },
  { name: 'nutifood.png', url: 'https://nutifood.com.vn/wp-content/uploads/2023/11/logo-nutifood.png' },
  { name: 'vinamilk.png', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Vinamilk_logo.svg/800px-Vinamilk_logo.svg.png' }
];

const dir = path.join(__dirname, 'public', 'logos');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

logos.forEach(logo => {
  const filePath = path.join(dir, logo.name);
  https.get(logo.url, (res) => {
    if (res.statusCode === 200) {
      const file = fs.createWriteStream(filePath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${logo.name}`);
      });
    } else {
      console.log(`Failed to download ${logo.name}: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.log(`Error downloading ${logo.name}: ${err.message}`);
  });
});
