import {
    
    // Food Items in Fast Food

    burger1, burger2, burger3, burger4, burger5, burger6, burger7, burger8, shawarma1, shawarma2, 
    shawarma3, sandwiches1, sandwiches2, sandwiches3, pizza1, pizza2, pizza3, pizza4, pizza5, pizza6, 
    pizza7, pizza8, pasta1, pasta2, pasta3, noodles1, noodles2, noodles3, noodles4, noodles5, noodles6, 
    noodles7, noodles8, broast1, broast2, broast3, 

    // Food Items in Desi Food

    karahi1, karahi2, karahi3, biryani1, biryani2, biryani3, pulao1, pulao2, pulao3, paaye1, paaye2, 
    paaye3, handi1, handi2, handi3, haleem1, haleem2, haleem3,

    // Snacks in Fast Food

    cheesesticks1, cheesesticks2, cheesesticks3, chickenuggets1, chickenuggets2, chickenuggets3,
    onionrings1, onionrings2, onionrings3, onionrings4, fries1, fries2, fries3, popcorn1, popcorn2, 
    popcorn3, popcorn4, fingers1, fingers2, fingers3, pizzafries1, pizzafries2, pizzafries3,
    paneerpakora1, paneerpakora2, paneerpakora3,

    // Snacks in Desi Food

    samosa1, samosa2, samosa3, samosa4, pakora1, pakora2, pakora3, roll1, roll2, roll3,
    golgappa1, golgappa2, golgappa3, chaat1, chaat2, chaat3, dahibhalla1, dahibhalla2, 
    dahibhalla3, alootikki1, alootikki2, alootikki3, shamikabab1, shamikabab2, shamikabab3,
    shamikabab4,

    // Shakes in Fast & Desi Food

    mango1, mango2, mango3, banana1, banana2, banana3, chocolate1, chocolate2, chocolate3,
    strawberry1, strawberry2, strawberry3,

    // Shake in Fast Food

    coffee1, coffee2, coffee3,

    // Shake in Desi Food

    vanilla1, vanilla2, vanilla3,

    // Drinks in Fast Food

    coca1, coca2, coca3, pepsi1, pepsi2, pepsi3, sprite1, sprite2, sprite3, up1, up2, up3,
    fanta1, fanta2, fanta3, sting1, sting2, sting3,

    // Drinks in Desi Food

    lassi1, lassi2, lassi3, lemonade1, lemonade2, lemonade3, rabri1, rabri2, rabri3,
    rabri4, rabri5, rabri6,  falooda1, falooda2, falooda3, falooda4, falooda5, falooda6, 
    roohafza1, roohafza2, roohafza3, water1, water2, water3, water4,

    // Desserts in Fast Food

    icecream1, icecream2, icecream3, icecream4, cake1, cake2, cake3, cake4, cake5, cake6,
    cupcakes1, cupcakes2, cupcakes3, cupcakes4, cupcakes5, cupcakes6, cookie1, cookie2, cookie3,
    donut1, donut2, donut3, sundae1, sundae2, sundae3, sundae4, 

    // Desserts in Desi Food

    kheer1, kheer2, kheer3, kheer4, halwa1, halwa2, halwa3, mithai1, mithai2, mithai3, mithai4,
    kulfi1, kulfi2, kulfi3, custard1, custard2, custard3, custard4, custard5, seviyan1, seviyan2, 
    seviyan3,

    // Bakery in Fast Food

    brownie1, brownie2, brownie3, muffin1, muffin2, muffin3, croissant1, croissant2, croissant3,
    danishpastry1, danishpastry2, danishpastry3, garlicbread1, garlicbread2, garlicbread3, garlicbread4, 
    garlicbread5, pastry1, pastry2, pastry3, pastry4,

    // Bakery in Desi Food

    rusk1, rusk2, rusk3, drycake1, drycake2, drycake3, drycake4, bread1, bread2, bread3,
    bun1, bun2, bun3, biscuits1, biscuits2, biscuits3, biscuits4, biscuits5, khatai1, khatai2, 
    khatai3, khatai4,

    // BBQ in Fast Food

    wings1, wings2, wings3, bbqnuguts1, bbqnuguts2, bbqnuguts3, bbqburger1, bbqburger2, bbqburger3,
    bbqsandwiches1, bbqsandwiches2, bbqsandwiches3, bbqsandwiches4, bbqsandwiches5, wrap1, wrap2, wrap3,

    // BBQ in Desi Food

    chickentikka1, chickentikka2, chickentikka3, seekh1, seekh2, seekh3, chapli1, chapli2, chapli3,
    fish1, fish2, fish3, malaiTikka1, malaiTikka2, malaitikka3,

    // Food Menu Main Categories

    fastfood, desifood, snacks, drinks, shakes, desserts, bakery, bbq
} from "./AllProductImg"
const AllProductData = [

    // Food Items in Fast Food

    {
        _id: 1, name: "Burger", price: 700,
        type: "Item",
        img: [burger1, burger2, burger3, burger4, burger5, burger6, burger7, burger8],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Food Items",
        status: "active"
    },
    {
        _id: 2, name: "Shawarma", price: 650,
        type: "Item",
        img: [shawarma1, shawarma2, shawarma3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Food Items",
        status: "active"
    },
    {
        _id: 3, name: "Sandwiches", price: 450,
        type: "Item",
        img: [sandwiches1, sandwiches2, sandwiches3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Food Items",
        status: "active"
    },
    {
        _id: 4, name: "Pizza", price: 2200,
        type: "Item",
        img: [pizza1, pizza2, pizza3, pizza4, pizza5, pizza6, pizza7, pizza8],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Food Items",
        status: "active"
    },
    {
        _id: 5, name: "Pasta", price: 600,
        type: "Item",
        img: [pasta1, pasta2, pasta3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Food Items",
        status: "active"
    },
    {
        _id: 6, name: "Noodles", price: 500,
        type: "Item",
        img: [noodles1, noodles2, noodles3, noodles4, noodles5, noodles6, noodles7, noodles8],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Food Items",
        status: "active"
    },
    {
        _id: 7, name: "Broast", price: 800,
        type: "Item",
        img: [broast1, broast2, broast3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Food Items",
        status: "active"
    },

    // Food Items in Desi Food

    {
        _id: 8, name: "Karahi", price: 1200,
        type: "Item",
        img: [karahi1, karahi2, karahi3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Food Items",
        status: "active"
    },
    {
        _id: 9, name: "Biryani", price: 150,
        type: "Item",
        img: [biryani1, biryani2, biryani3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Food Items",
        status: "active"
    },
    {
        _id: 10, name: "Pulao", price: 300,
        type: "Item",
        img: [pulao1, pulao2, pulao3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Food Items",
        status: "active"
    },
    {
        _id: 11, name: "Paaye", price: 800,
        type: "Item",
        img: [paaye1, paaye2, paaye3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Food Items",
        status: "active"
    },
    {
        _id: 12, name: "Handi", price: 1000,
        type: "Item",
        img: [handi1, handi2, handi3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Food Items",
        status: "active"
    },
    {
        _id: 13, name: "Haleem", price: 250,
        type: "Item",
        img: [haleem1, haleem2, haleem3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Food Items",
        status: "active"
    },

    // Snacks in Fast Food

    {
        _id: 14, name: "Cheesy Mozzarella Sticks", price: 550,
        type: "Item",
        img: [cheesesticks1, cheesesticks2, cheesesticks3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Snacks",
        status: "active"
    },
    {
        _id: 15, name: "Crispy Chicken Nuguts", price: 450,
        type: "Item",
        img: [chickenuggets1, chickenuggets2, chickenuggets3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Snacks",
        status: "active"
    },
    {
        _id: 16, name: "Golden Onion Rings", price: 350,
        type: "Item",
        img: [onionrings1, onionrings2, onionrings3, onionrings4],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Snacks",
        status: "active"
    },
    {
        _id: 17, name: "Classic French Fries", price: 300,
        type: "Item",
        img: [fries1, fries2, fries3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Snacks",
        status: "active"
    },
    {
        _id: 18, name: "Crispy Chicken Popcorn", price: 480,
        type: "Item",
        img: [popcorn1, popcorn2, popcorn3, popcorn4],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Snacks",
        status: "active"
    },
    {
        _id: 19, name: "Crunchy Chicken Fingers", price: 520,
        type: "Item",
        img: [fingers1, fingers2, fingers3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Snacks",
        status: "active"
    },
    {
        _id: 20, name: "Loaded Pizza Fries", price: 650,
        type: "Item",
        img: [pizzafries1, pizzafries2, pizzafries3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Snacks",
        status: "active"
    },
    {
        _id: 21, name: "Paneer Pakora Bites", price: 420,
        type: "Item",
        img: [paneerpakora1, paneerpakora2, paneerpakora3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Snacks",
        status: "active"
    },

    // Snacks in Desi Food

    {
        _id: 22, name: "Classic Samosa", price: 120,
        type: "Item",
        img: [samosa1, samosa2, samosa3, samosa4],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Snacks",
        status: "active"
    },
    {
        _id: 23, name: "Crispy Mix Pakora", price: 300,
        type: "Item",
        img: [pakora1, pakora2, pakora3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Snacks",
        status: "active"
    },
    {
        _id: 24, name: "Traditional Spring Roll", price: 280,
        type: "Item",
        img: [roll1, roll2, roll3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Snacks",
        status: "active"
    },
    {
        _id: 25, name: "Goll Gappa", price: 250,
        type: "Item",
        img: [golgappa1, golgappa2, golgappa3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Snacks",
        status: "active"
    },
    {
        _id: 26, name: "Desi Chaat Platter", price: 350,
        type: "Item",
        img: [chaat1, chaat2, chaat3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Snacks",
        status: "active"
    },
    {
        _id: 27, name: "Creamy Dahi Bhalla", price: 300,
        type: "Item",
        img: [dahibhalla1, dahibhalla2, dahibhalla3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Snacks",
        status: "active"
    },
    {
        _id: 28, name: "Spiced Aloo Tikki", price: 80,
        type: "Item",
        img: [alootikki1, alootikki2, alootikki3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Snacks",
        status: "active"
    },
    {
        _id: 29, name: "Shami Kabab", price: 180,
        type: "Item",
        img: [shamikabab1, shamikabab2, shamikabab3, shamikabab4],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Snacks",
        status: "active"
    },

    // Shakes in Fast & Desi Food

    {
        _id: 30, name: "Mango Shake", price: 300,
        type: "Item",
        img: [mango1, mango2, mango3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: ["Fast Food", "Desi Food"], subCategory: "Shakes",
        status: "active"
    },
    {
        _id: 31, name: "Banana Shake", price: 250,
        type: "Item",
        img: [banana1, banana2, banana3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: ["Fast Food", "Desi Food"], subCategory: "Shakes",
        status: "active"
    },
    {
        _id: 32, name: "Chocolate Shake", price: 350,
        type: "Item",
        img: [chocolate1, chocolate2, chocolate3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: ["Fast Food", "Desi Food"], subCategory: "Shakes",
        status: "active"
    },
    {
        _id: 33, name: "Strawberry Shake", price: 350,
        type: "Item",
        img: [strawberry1, strawberry2, strawberry3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: ["Fast Food", "Desi Food"], subCategory: "Shakes",
        status: "active"
    },

    // Shake in Fast Food

    {
        _id: 34, name: "Coffe Shake", price: 420,
        type: "Item",
        img: [coffee1, coffee2, coffee3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Shakes",
        status: "active"
    },

    // Shake in Desi Food

    {
        _id: 35, name: "Vanilla Shake", price: 300,
        type: "Item",
        img: [vanilla1, vanilla2, vanilla3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Shakes",
        status: "active"
    },

    // Drinks in Fast Food

    {
        _id: 36, name: "Coca Cola", price: 150,
        type: "Item",
        img: [coca1, coca2, coca3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Drinks",
        status: "active"
    },
    {
        _id: 37, name: "Pepsi", price: 150,
        type: "Item",
        img: [pepsi1, pepsi2, pepsi3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Drinks",
        status: "active"
    },
    {
        _id: 38, name: "Sprite", price: 150,
        type: "Item",
        img: [sprite1, sprite2, sprite3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Drinks",
        status: "active"
    },
    {
        _id: 39, name: "7UP", price: 150,
        type: "Item",
        img: [up1, up2, up3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Drinks",
        status: "active"
    },
    {
        _id: 40, name: "Fanta", price: 150,
        type: "Item",
        img: [fanta1, fanta2, fanta3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Drinks",
        status: "active"
    },
    {
        _id: 41, name: "Sting", price: 220,
        type: "Item",
        img: [sting1, sting2, sting3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Drinks",
        status: "active"
    },

    // Drinks in Desi Food

    {
        _id: 42, name: "Traditional Sweet Lassi", price: 220,
        type: "Item",
        img: [lassi1, lassi2, lassi3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Drinks",
        status: "active"
    },
    {
        _id: 43, name: "Fresh Lemonade", price: 180,
        type: "Item",
        img: [lemonade1, lemonade2, lemonade3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Drinks",
        status: "active"
    },
    {
        _id: 44, name: "Classic Rabri Milk", price: 250,
        type: "Item",
        img: [rabri1, rabri2, rabri3, rabri4, rabri5, rabri6],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Drinks",
        status: "active"
    },
    {
        _id: 45, name: "Rose Falooda Drink", price: 300,
        type: "Item",
        img: [falooda1, falooda2, falooda3, falooda4, falooda5, falooda6],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Drinks",
        status: "active"
    },
    {
        _id: 46, name: "Rooh Afza Sharbat", price: 200,
        type: "Item",
        img: [roohafza1, roohafza2, roohafza3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Drinks",
        status: "active"
    },
    {
        _id: 47, name: "Child Mineral Water", price: 80,
        type: "Item",
        img: [water1, water2, water3, water4],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Drinks",
        status: "active"
    },

    // Desserts in Fast Food

    {
        _id: 48, name: "Ice Creams", price: 220,
        type: "Item",
        img: [icecream1, icecream2, icecream3, icecream4],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Desserts",
        status: "active"
    },
    {
        _id: 49, name: "Cakes", price: 1500,
        type: "Item",
        img: [cake1, cake2, cake3, cake4, cake5, cake6],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Desserts",
        status: "active"
    },
    {
        _id: 50, name: "Cupcakes", price: 200,
        type: "Item",
        img: [cupcakes1, cupcakes2, cupcakes3, cupcakes4, cupcakes5, cupcakes6],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Desserts",
        status: "active"
    },
    {
        _id: 51, name: "Cookies", price: 180,
        type: "Item",
        img: [cookie1, cookie2, cookie3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Desserts",
        status: "active"
    },
    {
        _id: 52, name: "Donuts", price: 220,
        type: "Item",
        img: [donut1, donut2, donut3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Desserts",
        status: "active"
    },
    {
        _id: 53, name: "Sundae", price: 280,
        type: "Item",
        img: [sundae1, sundae2, sundae3, sundae4],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Desserts",
        status: "active"
    },

    // Desserts in Desi Food

    {
        _id: 54, name: "Classic Kheer", price: 250,
        type: "Item",
        img: [kheer1, kheer2, kheer3, kheer4],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Desserts",
        status: "active"
    },
    {
        _id: 55, name: "Traditional Halwa", price: 220,
        type: "Item",
        img: [halwa1, halwa2, halwa3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Desserts",
        status: "active"
    },
    {
        _id: 56, name: "Assorted Mithai", price: 1000,
        type: "Item",
        img: [mithai1, mithai2, mithai3, mithai4],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Desserts",
        status: "active"
    },
    {
        _id: 57, name: "Creamy Kulfi", price: 280,
        type: "Item",
        img: [kulfi1, kulfi2, kulfi3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Desserts",
        status: "active"
    },
    {
        _id: 58, name: "Rich Custard", price: 200,
        type: "Item",
        img: [custard1, custard2, custard3, custard4, custard5],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Desserts",
        status: "active"
    },
    {
        _id: 59, name: "Vermicelli Kheer", price: 240,
        type: "Item",
        img: [seviyan1, seviyan2, seviyan3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Desserts",
        status: "active"
    },

    // Bakery in Fast Food

    {
        _id: 60, name: "Brownie", price: 300,
        type: "Item",
        img: [brownie1, brownie2, brownie3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Bakery",
        status: "active"
    },
    {
        _id: 61, name: "Muffin", price: 150,
        type: "Item",
        img: [muffin1, muffin2, muffin3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Bakery",
        status: "active"
    },
    {
        _id: 62, name: "Croissant", price: 170,
        type: "Item",
        img: [croissant1, croissant2, croissant3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Bakery",
        status: "active"
    },
    {
        _id: 63, name: "Danish Pastry", price: 160,
        type: "Item",
        img: [danishpastry1, danishpastry2, danishpastry3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Bakery",
        status: "active"
    },
    {
        _id: 64, name: "Garlic Bread", price: 250,
        type: "Item",
        img: [garlicbread1, garlicbread2, garlicbread3, garlicbread4, garlicbread5],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Bakery",
        status: "active"
    },
    {
        _id: 65, name: "Pastry", price: 280,
        type: "Item",
        img: [pastry1, pastry2, pastry3, pastry4],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "Bakery",
        status: "active"
    },

    // Bakery in Desi Food

    {
        _id: 66, name: "Bakery Rusk", price: 150,
        type: "Item",
        img: [rusk1, rusk2, rusk3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Bakery",
        status: "active"
    },
    {
        _id: 67, name: "Dry Fruit Cake", price: 200,
        type: "Item",
        img: [drycake1, drycake2, drycake3, drycake4],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Bakery",
        status: "active"
    },
    {
        _id: 68, name: "Bread", price: 100,
        type: "Item",
        img: [bread1, bread2, bread3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Bakery",
        status: "active"
    },
    {
        _id: 69, name: "Classic Plain Bun", price: 50,
        type: "Item",
        img: [bun1, bun2, bun3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Bakery",
        status: "active"
    },
    {
        _id: 70, name: "Desi Biscuits", price: 180,
        type: "Item",
        img: [biscuits1, biscuits2, biscuits3, biscuits4, biscuits5],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Bakery",
        status: "active"
    },
    {
        _id: 71, name: "Traditional Nan Khatai", price: 180,
        type: "Item",
        img: [khatai1, khatai2, khatai3, khatai4],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "Bakery",
        status: "active"
    },

    // BBQ in Fast Food

    {
        _id: 72, name: "BBQ Chicken Wings", price: 850,
        type: "Item",
        img: [wings1, wings2, wings3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "BBQ",
        status: "active"
    },
    {
        _id: 73, name: "BBQ Chicken Nuguts", price: 650,
        type: "Item",
        img: [bbqnuguts1, bbqnuguts2, bbqnuguts3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "BBQ",
        status: "active"
    },
    {
        _id: 74, name: "BBQ Burger", price: 780,
        type: "Item",
        img: [bbqburger1, bbqburger2, bbqburger3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "BBQ",
        status: "active"
    },
    {
        _id: 75, name: "BBQ Sandwiches", price: 620,
        type: "Item",
        img: [bbqsandwiches1, bbqsandwiches2, bbqsandwiches3, bbqsandwiches4, bbqsandwiches5],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "BBQ",
        status: "active"
    },
    {
        _id: 76, name: "BBQ Wrap", price: 700,
        type: "Item",
        img: [wrap1, wrap2, wrap3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Fast Food", subCategory: "BBQ",
        status: "active"
    },

    // BBQ in Desi Food

    {
        _id: 77, name: "Chicken Tikka", price: 450,
        type: "Item",
        img: [chickentikka1, chickentikka2, chickentikka3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "BBQ",
        status: "active"
    },
    {
        _id: 78, name: "Sheekh Kabab", price: 400,
        type: "Item",
        img: [seekh1, seekh2, seekh3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "BBQ",
        status: "active"
    },
    {
        _id: 79, name: "Chapli Kabab", price: 350,
        type: "Item",
        img: [chapli1, chapli2, chapli3],
        showInSpecial: false, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "BBQ",
        status: "active"
    },
    {
        _id: 80, name: "Fish Fry", price: 500,
        type: "Item",
        img: [fish1, fish2, fish3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "BBQ",
        status: "active"
    },
    {
        _id: 81, name: "Malai Tikka", price: 480,
        type: "Item",
        img: [malaiTikka1, malaiTikka2, malaitikka3],
        showInSpecial: true, showInMegaMenu: true, showInFoodMenu: false,
        mainCategory: "Desi Food", subCategory: "BBQ",
        status: "active"
    },
    
    // Food Menu Main Categories

    {
        _id: 82, name: "Fast Food", price: null,
        type: "Category",
        img: [fastfood],
        link: "/mega-menu",
        showInSpecial: false, showInMegaMenu: false, showInFoodMenu: true,
        status: "active",
        category: "Food"
    },
    {
        _id: 83, name: "Desi Food", price: null,
        type: "Category",
        img: [desifood],
        link: "/mega-menu",
        showInSpecial: false, showInMegaMenu: false, showInFoodMenu: true,
        status: "active",
        category: "Food"
    },
    {
        _id: 84, name: "Snacks", price: null,
        type: "Category",
        img: [snacks],
        link: "/mega-menu",
        showInSpecial: false, showInMegaMenu: false, showInFoodMenu: true,
        status: "active",
        category: "Food"
    },
    {
        _id: 85, name: "Drinks", price: null,
        type: "Category",
        img: [drinks],
        link: "/mega-menu",
        showInSpecial: false, showInMegaMenu: false, showInFoodMenu: true,
        status: "active",
        category: "Food"
    },
    {
        _id: 86, name: "Shakes", price: null,
        type: "Category",
        img: [shakes],
        link: "/mega-menu",
        showInSpecial: false, showInMegaMenu: false, showInFoodMenu: true,
        status: "active",
        category: "Food"
    },
    {
        _id: 87, name: "Desserts", price: null,
        type: "Category",
        img: [desserts],
        link: "/mega-menu",
        showInSpecial: false, showInMegaMenu: false, showInFoodMenu: true,
        status: "active",
        category: "Food"
    },
    {
        _id: 88, name: "Bakery", price: null,
        type: "Category",
        img: [bakery],
        link: "/mega-menu",
        showInSpecial: false, showInMegaMenu: false, showInFoodMenu: true,
        status: "active",
        category: "Food"
    },
    {
        _id: 89, name: "BBQ", price: null,
        type: "Category",
        img: [bbq],
        link: "/mega-menu",
        showInSpecial: false, showInMegaMenu: false, showInFoodMenu: true,
        status: "active",
        category: "Food"
    },
]

export default AllProductData