cara buat unit test:

1. cd frontend, lalu npm install
2. buat unittest yang sesuai utk setiap components dan pages 
3. di terminal (yg udah cd ke frontend): jalankan npm test
    contoh:  npm test -- tests/components/Chatbox.test.js   (hanya utk satu file)
            npm test                                        (bisa untuk semua test files)

4. NOTE: JANGAN SENTUH babel.config.cjs DAN jest.config.cjs  
5. NOTE: JANGAN REINSTALL REACT ATAU DOWNGRADE REACT VERSION ATAU SEJENISNYA

kalau ada bug utk pages atau components, silakan di debug. 
Kalau gak bisa di debug tanpa reinstall react semacamnya, taruh nama jsx yang bermasalah di Trello (nanti aku yang urus)



