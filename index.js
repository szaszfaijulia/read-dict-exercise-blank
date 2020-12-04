//Írj egy error first callback-et meghívó aszinkron fügvényt, ami visszaadja a texts könyvtárban fevő fájlokból kiolvasott szövegekből konkatenált sztringet (a texts könyvtárban bármyennyi szövegfájl lehet)
//A könyvtár fájl listájának és a szövegfájlok tartalmának kiolvasásához az fs modul aszinkron függvényeit (readdir, readFile) használd

const fs = require('fs');
const path = require('path')

const promise = (texts) => 
  new Promise((resolve, reject) =>  //teljesít, visszautasít
    fs.readdir(path.join(texts), (err, content) => {
      //kiolvassuk a könyvtárbejegyzések listáját, (elérési út, error first callback)
      if (err) {
        reject(err);  //a promise catch fv-e kapja
      } else {
        resolve(content); //a promise then fv-e kapja
      }
    })
  )
  .then(content =>
    Promise.all(    //promise-all-nak promeise-okat tartalmazó fv-eket adunk át
      content.map(text =>   //forEach
        new Promise((resolve, reject) =>
          fs.readFile(path.join('texts', text), (err, content) => {
            // fájlok tartalmának kiolvasása,
            // (elérési út, error first callback - a 2. paraméter kapja meg a fájl tartalmát)
            // path.join - összerakja az elérési utat
            if (err) {
              reject(err);
            } else {
              resolve(content);
            }
          })
        )
        .then(content => content.toString())  //stringgé alakítja
        .catch(err => console.log(err))
      )
    )
    .then(result => result.join(' ')) //összekapcsolja
    .catch(err => console.log(err))
  )
  .catch(err => console.log(err));

promise('texts')  //szintén asszinkron, mindkét fv-e callback-et vár
  .then(content => console.log(content))  //ha a kérés kiszolgálása sikeres volt
  .catch(err => console.log(err))  //ha hiba történt




/*function texts(readTexts){
  console.log(readTexts());
}*/

/*for (let i=0; (fs.readdir('texts', (err, entries) => i < entries.length)); i++ ){
  const promise = new Promise((resolve, reject) => {
      fs.readFile(path.join('texts', 'text'+i+'.txt'),(err, content) => {
          if (err) {
              reject(err);
          } else {
              resolve(content);
          }
      });
  })
  //console.log(i);
}*/

//fs.readdir('texts', (err, entries) => console.log(entries.length));
//fs.readdir('texts', (err, entries) => console.log(2 < entries.length));
/*let i=1;
fs.readdir('texts', (err, entries) => console.log(i < entries.length));*/