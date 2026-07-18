export interface CatalogItem {
  id: string;
  name: string;
  desc: string;
  price: string;
  image: string;
  tag?: string;
  kcal?: string;
  time?: string;
}

export interface CatalogSubcategory {
  id: string;
  name: string;
  items: CatalogItem[];
}

export interface CatalogCategory {
  id: string;
  name: string;
  image: string;
  desc: string;
  subcategories: CatalogSubcategory[];
}

export interface CatalogTheme {
  bg: string;
  cardBg: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  border: string;
  pillBg: string;
  pillText: string;
  pillActiveBg: string;
  pillActiveText: string;
  font: string;
  radius: string;
  showLogo: boolean;
}

export interface CatalogInfo {
  phone: string;
  address: string;
  hours: string;
  mapsUrl: string;
  name?: string;
  logo?: string;
  currency?: string;
  language?: string;
  about?: string;
}

export interface CatalogSeed {
  categories: CatalogCategory[];
  info: CatalogInfo;
  theme: CatalogTheme;
}

export const DEFAULT_THEME: CatalogTheme = {
  bg: "#fef7ee",
  cardBg: "#ffffff",
  text: "#2d2416",
  muted: "#8a7a64",
  accent: "#c97b5e",
  accentText: "#ffffff",
  border: "#e5ddd0",
  pillBg: "#ffffff",
  pillText: "#2d2416",
  pillActiveBg: "#c97b5e",
  pillActiveText: "#ffffff",
  font: "Inter",
  radius: "12px",
  showLogo: false,
};

const B = "https://hreqqnwsivtzewpjcwcs.supabase.co/storage/v1/object/public/catalog-images/seed";

const img = (file: string) => `${B}/${file}`;

function gid() {
  return Math.random().toString(36).substring(2, 9);
}

export const SEED_CATALOG: CatalogSeed = {
  categories: [
    {
      id: "main-courses",
      name: "Main courses",
      image: img("main-course-5.webp"),
      desc: "Hearty plates for every craving",
      subcategories: [
        {
          id: "burgers",
          name: "Burgers",
          items: [
            { id: gid(), name: "Swedish Burger", desc: "Meat petty, mushroom sauce, cherry tomato, yellow cheese, cucumber pickle", price: "4.20", image: img("a-close-up-of-a-burger-with-beef-patty-with-vegeta-2024-11-26-10-45-47-utc-1.webp"), tag: "Signature", kcal: "350", time: "88" },
            { id: gid(), name: "Loaded Crispy Chicken Burger", desc: "Crispy thai chicken, bacon, halapeno, traffile sauce, crispy onion with 2 mozzarela sticks", price: "2.80", image: img("chicken-burger-with-bacon-on-wooden-board-front-v-2025-01-10-04-01-23-utc-1.webp"), kcal: "290", time: "73" },
            { id: gid(), name: "Marilla Solo Burger", desc: "Beef petty with stuffing cheese, onion ring, Bacon, halapeno, grilled mash garlic, traffile sauce", price: "3.00", image: img("burger-and-ingredients-2025-01-09-07-47-39-utc-1.webp") },
            { id: gid(), name: "Veggie Burger", desc: "Mash chickpeas with sauted mushrooms, oats, and spices; shape patties, pan-fry, and serve on buns", price: "2.60", image: img("delicious-food-for-islamic-new-year-2025-07-07-19-46-21-utc-1.webp"), tag: "Vegan", kcal: "115", time: "29" },
            { id: gid(), name: "American Burger", desc: "Beef grilled steak, rocca leaves, avocado, honey, signature sauce with garlic", price: "35.00", image: img("delicious-juicy-classic-beef-burger-and-crispy-vil-2025-02-02-20-16-09-utc.webp"), kcal: "410", time: "103" },
            { id: gid(), name: "il Piatto Burger", desc: "Beef mash, BBQ sauce, liquid cheese, cucumber pickle, lollo rosso, honey, signature sauce with garlic", price: "4.00", image: img("homemade-hamburger-served-with-french-fries-2025-03-25-21-21-20-utc.webp"), kcal: "215", time: "54" },
          ],
        },
        {
          id: "arabic-food",
          name: "Arabic Food",
          items: [
            { id: gid(), name: "Laham Mansaf Medium", desc: "500 gm lamb, rice, white sauce, almond sliced", price: "50.00", image: img("mansaf-jordanian-national-dish-2025-03-08-00-34-30-utc-1.webp"), tag: "Chef's Special", kcal: "400", time: "100" },
            { id: gid(), name: "Safi with Muhammar Rice Medium", desc: "6 Pieces safi fish with rice and tahenia sauce", price: "60.00", image: img("Safi-with-muhammar-Rice.webp"), kcal: "340", time: "85" },
            { id: gid(), name: "Quil Majboos Quarter", desc: "2 Piece quail with bukhari rice and daqoos", price: "35.00", image: img("Quil-Majboos-Rice.webp"), kcal: "310", time: "78" },
            { id: gid(), name: "Sea Bream Fish", desc: "Anychoice of Rice with 500 gm grill sabreem fish marinted with green herbal sauce/ilpiatto special sauce/spicy sauce (optional)", price: "38.00", image: img("Sea-bream-fish.webp"), tag: "Healthy", kcal: "400", time: "100" },
            { id: gid(), name: "Safi with Muhammar Rice Quarter", desc: "3 Pieces safi fish with rice and tahenia sauce", price: "60.00", image: img("Safi-with-muhammar-Rice.webp"), kcal: "620", time: "155" },
            { id: gid(), name: "Laham Mansaf Quarter", desc: "300 gm lamb, rice, white sauce, almond sliced", price: "30.00", image: img("mansaf-jordanian-national-dish-2025-03-08-00-34-30-utc-1.webp"), kcal: "277", time: "69" },
          ],
        },
        {
          id: "starters",
          name: "Starters",
          items: [
            { id: gid(), name: "Dynamite Shrimps", desc: "Our special 6 pcs dynamite shrimps with special imported sauces", price: "3.50", image: img("breaded-torpedo-shrimps-2024-10-18-09-19-13-utc.webp"), kcal: "250", time: "63" },
            { id: gid(), name: "Tempura Shrimp", desc: "4 pcs of tempura shrimps with tempura sauce and sweet chilli sauce", price: "2.00", image: img("japanese-lunch-composition-2025-04-04-08-27-01-utc.webp"), tag: "Best Seller" },
            { id: gid(), name: "Buffalo Shrimps", desc: "Crispy and spicy shrimps bites with buffalo sauce", price: "3.20", image: img("fried-shrimps-tempura-with-sweet-chili-sauce-2025-02-21-02-23-26-utc.webp") },
            { id: gid(), name: "Chicken Nuggets", desc: "Made with 100% all white meat, crunchy on outside and juicy from inside", price: "2.00", image: img("nuggets-chicken-nuggets-with-ketchup-on-wooden-ta-2025-02-18-07-07-19-utc.webp") },
            { id: gid(), name: "Potato Wedges", desc: "Made with potatoes cut into vagies and seasoned with a blend of herbs and spices", price: "2.00", image: img("roasted-potatoes-with-parmesan-and-herbs-served-wi-2025-04-12-05-19-52-utc.webp") },
            { id: gid(), name: "Hot Dog", desc: "Plate of grilled hot dog sausages served with sides and condiments", price: "2.50", image: img("sausages-2025-01-10-19-08-43-utc.webp") },
          ],
        },
        {
          id: "soups",
          name: "Soups",
          items: [
            { id: gid(), name: "Italian Soup", desc: "Ravioli, bricked beans, tomato sauce, garnished with parsley & mozzarela cheese", price: "3.50", image: img("tomato-soup-with-tortellini-2025-03-07-16-01-07-utc.webp") },
            { id: gid(), name: "Lentil Soup", desc: "Cubes breads, lemon, lentil", price: "2.00", image: img("healthy-vegan-lentil-cream-soup-2025-07-14-18-30-33-utc-1.webp") },
            { id: gid(), name: "Pumpkin Soup", desc: "Pumpkin, cream, mushrooms, garlic bread with mustard honey sauce", price: "3.00", image: img("concept-of-tasty-food-with-pumpkin-soup-on-gray-te-2025-03-25-16-43-55-utc-1.webp") },
            { id: gid(), name: "Shrimp Soup", desc: "Shrimps, cream with garlic bread", price: "3.00", image: img("creamy-soup-with-seafood-and-lemon-on-a-white-back-2025-01-09-01-59-36-utc-1.webp") },
            { id: gid(), name: "Tom Yum Soup", desc: "Shrimps, calamary, crabs", price: "3.50", image: img("tom-yum-soup-with-shrimps-lime-chili-pepper-and-2025-02-15-14-32-31-utc-1.webp") },
            { id: gid(), name: "Chicken Corn Soup", desc: "Chicken, cabbage, corn, eggs", price: "2.50", image: img("chinese-corn-and-chicken-soup-healthy-food-style-2025-03-09-08-55-21-utc-1.webp") },
          ],
        },
        {
          id: "salad",
          name: "Salad",
          items: [
            { id: gid(), name: "Italian Salad", desc: "Fetta cheese, sliced black olives, cucumber, capsicum, red onion, parsley, italian sauce", price: "3.50", image: img("vegetable-salad-with-cheese-mozzarella-tomatoes-2025-02-09-22-46-39-utc.webp") },
            { id: gid(), name: "Pineapple Shrimps Salad", desc: "Pine apple, shrimps, cubes potato and raspberry chef special sauce", price: "4.00", image: img("salad-with-mango-shrimp-and-avocado-on-white-plat-2024-10-20-00-38-43-utc.webp") },
            { id: gid(), name: "Thousand Salad", desc: "Cucumber, capsicum, ice burg Lettuce, chickpeas, chicken with thousand sauce", price: "3.00", image: img("top-view-mayyonaise-salad-with-different-vegetable-2025-02-10-11-35-39-utc-1.webp") },
            { id: gid(), name: "Beetroot Salad", desc: "Beetroot fetta cheese & olive oil, parsley", price: "3.00", image: img("salad-with-beet-curd-feta-ricotta-and-pine-nuts-2024-10-18-05-45-05-utc-1.webp") },
            { id: gid(), name: "Costrola Salad", desc: "Avocado, rocca leave, pomegranate, crushed chicken, yellow cheese", price: "3.50", image: img("salad-salmon-with-avocado-grapefruit-and-pomegran-2025-02-19-02-51-02-utc-1.webp") },
            { id: gid(), name: "Gravity Salad", desc: "Mango, green lulu bionda, avocado, roman sauce", price: "3.00", image: img("roamn-sauce.webp") },
          ],
        },
      ],
    },
    {
      id: "breakfast",
      name: "Breakfast",
      image: img("categorize-design-v1.webp"),
      desc: "Morning favorites to start fresh",
      subcategories: [
        {
          id: "eggs",
          name: "Eggs",
          items: [
            { id: gid(), name: "Omega 3 Egg", desc: "", price: "1.000", image: img("boiled-sliced-egg-food-photo-2025-04-01-11-44-51-utc-1.webp") },
            { id: gid(), name: "Omega 3 Eggs", desc: "3 Piece of boiled special omega 3 eggs", price: "1.500", image: img("boiled-sliced-egg-food-photo-2025-04-01-11-44-51-utc-1.webp") },
            { id: gid(), name: "Organic Egg", desc: "", price: "1.000", image: img("boiled-sliced-egg-food-photo-2025-03-26-13-42-36-utc-1.webp") },
            { id: gid(), name: "Organic Eggs", desc: "5 Pieces of healthy boiled organic eggs", price: "1.500", image: img("boiled-sliced-egg-food-photo-2025-03-26-13-42-36-utc-1.webp") },
          ],
        },
        {
          id: "sandwiches",
          name: "Sandwiches",
          items: [
            { id: gid(), name: "Tuna Sandwich", desc: "Flaked tuna mixed with mayo and your choice of fresh vegetables", price: "3.000", image: img("tuna-sandwich-with-mayo-and-vegetables-on-gray-sto-2025-06-05-20-59-29-utc.webp") },
            { id: gid(), name: "Veggie Delight Sandwich (m)", desc: "Delicious combination of garden-fresh lettuce, tomatoes, green peppers...", price: "4.000", image: img("tasty-sandwich-served-with-lemonade-in-the-kitchen-2025-03-24-04-00-08-utc.webp") },
            { id: gid(), name: "Veggie Delight Sandwich", desc: "Delicious combination of garden-fresh lettuce, tomatoes, green peppers...", price: "3.500", image: img("tasty-sandwich-served-with-lemonade-in-the-kitchen-2025-03-24-04-00-08-utc.webp") },
            { id: gid(), name: "Breakfast Sandwich", desc: "Mash avocado with 2 omega 3 eggs, fresh vegetables, lettuce, cucumber...", price: "3.200", image: img("fried-egg-fresh-salad-and-avocado-guacamole-sandw-2025-02-21-00-06-43-utc-1.webp") },
          ],
        },
        {
          id: "croissants",
          name: "Croissants",
          items: [
            { id: gid(), name: "Nutella Croissant (m)", desc: "Nutela, banana, kunafa crums, pistachio sliced almond and vanilla...", price: "3.500", image: img("a-wooden-cutting-board-topped-with-three-pastries-2025-02-11-19-43-21-utc-1.webp") },
            { id: gid(), name: "Nutella Croissant", desc: "Nutela, banana, kunafa crums, pistachio sliced almond and vanilla...", price: "3.000", image: img("a-wooden-cutting-board-topped-with-three-pastries-2025-02-11-19-43-21-utc-1.webp") },
            { id: gid(), name: "Croissant Land", desc: "Scrambeld egg, mushroom sauce, beef finger, honey and avocado, yellow...", price: "3.500", image: img("croissant-sandwich-with-mushrooms-and-lettuce-on-a-2025-02-03-04-54-35-utc-1.webp") },
            { id: gid(), name: "il piatto Croissant", desc: "Rocca leave, traffile sauce, turkey bacon, mash beaf and chili fl...", price: "3.000", image: img("tasty-croissant-with-salad-and-salmon-on-white-pla-2025-02-22-01-44-17-utc.webp") },
          ],
        },
      ],
    },
    {
      id: "pizza",
      name: "Pizza",
      image: img("categorize-design-v1-1.webp"),
      desc: "Hand tossed pies with bold toppings",
      subcategories: [
        {
          id: "italian-pizza",
          name: "Italian Pizza",
          items: [
            { id: gid(), name: "Vegetariana", desc: "Tomato sauce, mozzarella, roasted red peppers, eggplant, zucchini...", price: "6.500", image: img("vegetarian-pizza-with-aubergines-and-zucchini-2025-03-18-17-47-49-utc-1.webp"), tag: "veggie", kcal: "490", time: "20" },
            { id: gid(), name: "Bresaola e Rucola", desc: "Tomato sauce, mozzarella, bresaola, arugula and parmesan cheese", price: "8.900", image: img("flat-lay-with-italian-pizza-and-various-ingredient-2024-11-18-02-13-11-utc-1-1.webp"), kcal: "700", time: "25" },
            { id: gid(), name: "Capricciosa", desc: "Tomato sauce, mozzarella, bresaola, mushrooms, marinated artichoke...", price: "6.000", image: img("fresh-italian-pizza-with-mushrooms-ham-tomatoes-2024-10-11-07-42-15-utc-1.webp"), kcal: "783" },
            { id: gid(), name: "Classic Margherita", desc: "Tomato sauce, fresh mozzarella and finely chopped basil", price: "5.000", image: img("pizza-margherita-homemade-2024-09-23-13-51-43-utc.webp"), kcal: "600" },
            { id: gid(), name: "Diavola", desc: "Tomato sauce, mozzarella, spicy red peppers and pepperoni", price: "4.000", image: img("fresh-delicious-italian-pizza-2024-12-13-07-54-55-utc-1.webp"), kcal: "566" },
            { id: gid(), name: "Formaggi (v)", desc: "Gorgonzola, mozzarella, emmenthal and parmesan cheese", price: "6.000", image: img("pizzaa.webp") },
          ],
        },
        {
          id: "minnie-pizza",
          name: "Minnie Pizza",
          items: [
            { id: gid(), name: "Lebanon Bilzatir Pizza", desc: "", price: "0.500", image: img("lebonan-pizza.webp") },
            { id: gid(), name: "Pepproni Pizza", desc: "", price: "0.600", image: img("pepproni-pizza.webp") },
            { id: gid(), name: "Spinach Pizza", desc: "", price: "0.600", image: img("spenich-pizza.webp") },
            { id: gid(), name: "Vegetable Pizza", desc: "", price: "0.500", image: img("vegetables-pizza.webp") },
            { id: gid(), name: "Zattir Pizza", desc: "", price: "0.700", image: img("ZATIR-PIZZA.webp") },
            { id: gid(), name: "Chicken Grill Pizza", desc: "", price: "0.500", image: img("chicken-grill-pizza-1.webp") },
          ],
        },
        {
          id: "brisket-pizza",
          name: "Brisket Pizza",
          items: [
            { id: gid(), name: "Shrimps Grill Pizza", desc: "Shrimps, red onion, rocca leave, parmesan cheese, chef special sauce...", price: "5.000", image: img("shrimp-pizza-1-1.webp") },
            { id: gid(), name: "Beef Lover Pizza Large", desc: "Beef, ranch sauce, rocca Leave, parmesan cheese, mozzarela cheese", price: "4.500", image: img("beef-pizza-1.webp") },
            { id: gid(), name: "Beef Lover Pizza Medium", desc: "Beef, ranch sauce, rocca Leave, parmesan cheese, mozzarela cheese", price: "5.500", image: img("beef-pizza-1.webp") },
            { id: gid(), name: "Chicken Grill Green Pizza Large", desc: "Spinach, soya, chicken grill, burrata cheese", price: "5.000", image: img("green-pizza-1.webp") },
            { id: gid(), name: "Chicken Grill Green Pizza Medium", desc: "Spinach, soya, chicken grill, burrata cheese", price: "4.500", image: img("green-pizza-1.webp") },
            { id: gid(), name: "Grilled Eggplant Pizza", desc: "Dry peeled tomato, burrata cheese, eggplant, dry rosemary", price: "6.000", image: img("eggplant-pizza-1.webp") },
          ],
        },
      ],
    },
    {
      id: "desserts",
      name: "Desserts",
      image: img("categorize-design-v1-2.webp"),
      desc: "Sweet bites to treat yourself",
      subcategories: [
        {
          id: "italian-dolce",
          name: "Italian Dolce",
          items: [
            { id: gid(), name: "Panna cotta", desc: "Smooth classic italian cooked cream topped with fresh raspberries", price: "3.00", image: img("Panna-cotta.webp") },
            { id: gid(), name: "Tiramisù", desc: "Classic Italian coffee flavored dessert with mascarpone cream and cocoa", price: "3.50", image: img("Tiramisu-1.webp") },
            { id: gid(), name: "Tortino di Mele con Gelato", desc: "Thin crispy apple tart with vanilla gelato", price: "3.00", image: img("Tortino-di-Mele-con-Gelato.webp") },
            { id: gid(), name: "Affogato al Caffe", desc: "Vanilla gelato, drowned in a shot of rich, hot espresso", price: "3.00", image: img("Affogato-al-Caffe.webp") },
            { id: gid(), name: "Coppa di Fragole e Gelato", desc: "Fresh seasonal strawberries layered with our homemade vanilla gelato", price: "3.50", image: img("Coppa-di-Fragole-e-Gelato.webp") },
            { id: gid(), name: "Gelati Misti (3 scoops)", desc: "Selection of gelato (ask your server for today's flavour)", price: "4.00", image: img("Gelati-Misti.webp") },
          ],
        },
        {
          id: "puddings-creams",
          name: "Puddings & Creams",
          items: [
            { id: gid(), name: "Qunafa with Gulab Jamun and Vanilla Cream", desc: "", price: "2.00", image: img("turkish-dessert-kunefe-served-with-ice-cream-on-wo-2025-02-25-19-14-58-utc.webp") },
            { id: gid(), name: "Cream Caramel (s)", desc: "", price: "3.00", image: img("dalgona-coffee-drink-with-coffee-foam-and-milk-2025-01-09-03-03-18-utc.webp") },
            { id: gid(), name: "Cream Caramel", desc: "", price: "4.00", image: img("dalgona-coffee-drink-with-coffee-foam-and-milk-2025-01-09-03-03-18-utc.webp") },
            { id: gid(), name: "Fruit Slice with Vanilla Cream and Nutella", desc: "", price: "2.50", image: img("ice-cream-and-berry-fruits-with-chocolate-sauce-an-2024-12-13-05-40-08-utc-1.webp") },
          ],
        },
        {
          id: "pastries-cookies",
          name: "Pastries & Cookies",
          items: [
            { id: gid(), name: "Italian Pastry with Pistachio Paste", desc: "", price: "0.50", image: img("vertical-closeup-of-a-new-york-roll-with-pistachio-2025-02-02-14-08-36-utc.webp") },
            { id: gid(), name: "Special Crunchy Crispy Italian Cookie", desc: "3 pieces of cookies made with butter, almond, walnut, pistachio, pe...", price: "2.00", image: img("oatmeal-cookies-sprinkled-with-cereal-grains-2025-01-07-23-27-26-utc.webp") },
            { id: gid(), name: "Special Donuts", desc: "", price: "1.00", image: img("glazed-chocolate-and-pink-donuts-on-marble-backgro-2025-02-10-05-35-43-utc.webp") },
            { id: gid(), name: "Donuts", desc: "", price: "2.50", image: img("glazed-chocolate-and-pink-donuts-on-marble-backgro-2025-02-10-05-35-43-utc.webp") },
          ],
        },
      ],
    },
    {
      id: "beverages",
      name: "Beverages",
      image: img("categorize-design-v1-3.webp"),
      desc: "Cool drinks to refresh your day",
      subcategories: [
        {
          id: "teas",
          name: "Teas",
          items: [
            { id: gid(), name: "Karak Tea", desc: "A special Karak Tea with Unbeleiveable taste", price: "0.60", image: img("karak-tea.webp") },
            { id: gid(), name: "Moroccan Tea", desc: "A fragrant and flavourful tea with moroccan inspired flavours...", price: "0.50", image: img("morocan-tea.webp") },
            { id: gid(), name: "Special Strong Tea", desc: "Made with 100 % fresh milk, ginger and cardimon", price: "0.60", image: "" },
            { id: gid(), name: "Strong Tea", desc: "100% fresh milk and imported black Tea made in sparkling wat...", price: "0.50", image: img("special-black-tea.webp") },
            { id: gid(), name: "Black Tea", desc: "A classic and flavourful tea drink made with black tea leave...", price: "10.00", image: img("black-tea.webp"), tag: "New", kcal: "15", time: "5" },
            { id: gid(), name: "Green Tea", desc: "Green tea with mint", price: "0.50", image: img("mint-tea-500x500-1.webp") },
          ],
        },
        {
          id: "hot-coffees",
          name: "Hot Coffees",
          items: [
            { id: gid(), name: "Latte", desc: "Served with an il Piatto cookie", price: "1.50", image: img("coffee-latte-art-2025-03-25-16-22-03-utc.webp") },
            { id: gid(), name: "Macchiato Green (Single/Double)", desc: "Served with an il Piatto cookie", price: "2.00", image: img("matcha-latte-with-latte-art-a-cup-of-japanese-gre-2024-12-02-03-17-00-utc.webp") },
            { id: gid(), name: "Americano", desc: "Served with an il Piatto cookie", price: "1.30", image: img("cup-of-coffee-2025-02-14-13-35-22-utc.webp") },
            { id: gid(), name: "Cappuccino", desc: "Served with an il Piatto cookie", price: "1.00", image: img("white-coffee-cup-on-a-white-plate-surrounded-by-co-2025-02-11-23-58-35-utc.webp") },
            { id: gid(), name: "Espresso (Single/Double)", desc: "Served with an il Piatto cookie", price: "1.50", image: img("cup-of-espresso-with-coconut-cookies-on-a-plate-2025-03-12-20-36-13-utc.webp") },
            { id: gid(), name: "Flat White", desc: "Served with an il Piatto cookie", price: "1.50", image: img("cappuccino-white-coffee-cup-with-heart-shape-art-2024-12-10-01-18-55-utc.webp") },
          ],
        },
      ],
    },
  ],
  info: {
    name: "Il Piatto",
    phone: "+973 3798 9445",
    address: "Juffair Ave, Manama, Bahrain",
    hours: "Mon-Sun 12:00-23:00",
    mapsUrl: "https://maps.app.goo.gl/AGPHrBx2oqi4JUMU9",
    currency: "BHD",
    language: "en",
  },
  theme: {
    bg: "#fef7ee",
    cardBg: "#ffffff",
    text: "#2d2416",
    muted: "#8a7a64",
    accent: "#c97b5e",
    accentText: "#ffffff",
    border: "#e5ddd0",
    pillBg: "#ffffff",
    pillText: "#2d2416",
    pillActiveBg: "#c97b5e",
    pillActiveText: "#ffffff",
    font: "Inter",
    radius: "16px",
    showLogo: false,
  },
};

export const SEED_PRODUCTOS: CatalogSeed = {
  categories: [
    {
      id: "electronics",
      name: "Electronics",
      image: img("electronics.jpg"),
      desc: "Latest gadgets and devices at the best prices",
      subcategories: [
        {
          id: "headphones",
          name: "Headphones & Audio",
          items: [
            { id: gid(), name: "Sony WH-1000XM6", desc: "Industry-leading ANC, 30h battery, LDAC Hi-Res Audio", price: "349.00", image: img("headphones.jpg"), tag: "Best Seller" },
            { id: gid(), name: "AirPods Pro 3", desc: "Active Noise Cancellation, Adaptive Audio, USB-C MagSafe", price: "249.00", image: img("headphones.jpg") },
            { id: gid(), name: "JBL Flip 7", desc: "Portable BT 5.4 speaker, IP67 waterproof, 20h battery", price: "129.95", image: img("speaker.jpg") },
            { id: gid(), name: "Bose QC Ultra Headphones", desc: "World-class noise cancellation, Immersive Audio, 24h", price: "429.00", image: img("headphones.jpg"), tag: "Premium" },
            { id: gid(), name: "Samsung Galaxy Buds3 Pro", desc: "2-way speakers, Adaptive ANC, Galaxy AI features", price: "219.99", image: img("headphones.jpg") },
          ],
        },
        {
          id: "smartwatches",
          name: "Smartwatches",
          items: [
            { id: gid(), name: "Apple Watch Series 11", desc: "ECG, Blood Oxygen, Crash Detection, LTPO3 display", price: "469.00", image: img("smartwatch.jpg"), tag: "Best Seller" },
            { id: gid(), name: "Samsung Galaxy Watch 8", desc: "Wear OS, BioActive sensor, Antioxidant Index, sleep coach", price: "329.99", image: img("smartwatch.jpg") },
            { id: gid(), name: "Garmin Forerunner 265", desc: "AMOLED display, training metrics, GPS, 13-day battery", price: "449.99", image: img("smartwatch.jpg") },
            { id: gid(), name: "Fitbit Charge 6", desc: "Built-in GPS, heart rate, stress management, 7-day battery", price: "159.95", image: img("smartwatch.jpg") },
            { id: gid(), name: "Google Pixel Watch 3", desc: "Fitbit integration, Pixel AI, Google Assistant", price: "349.99", image: img("smartwatch.jpg") },
          ],
        },
        {
          id: "laptops",
          name: "Laptops & Tablets",
          items: [
            { id: gid(), name: "MacBook Air M4", desc: "Apple M4 chip, 15.3\" Liquid Retina, 18h battery, 16GB RAM", price: "1,299.00", image: img("laptop.jpg"), tag: "New" },
            { id: gid(), name: "iPad Pro M4 13\"", desc: "Ultra XDR display, M4 chip, Apple Pencil Pro support", price: "1,299.00", image: img("laptop.jpg") },
            { id: gid(), name: "Samsung Galaxy Tab S10 Ultra", desc: "14.6\" Dynamic AMOLED, S Pen, 10h battery", price: "1,199.99", image: img("laptop.jpg") },
            { id: gid(), name: "Dell XPS 16", desc: "Intel Core Ultra 9, 32GB RAM, OLED 4K touch, 16h", price: "2,199.00", image: img("laptop.jpg") },
            { id: gid(), name: "Asus ROG Ally X", desc: "AMD Ryzen Z1 Extreme, 7\" 120Hz, 24GB RAM, 1TB SSD", price: "799.99", image: img("laptop.jpg") },
          ],
        },
      ],
    },
    {
      id: "fashion",
      name: "Fashion",
      image: img("fashion.jpg"),
      desc: "Trending styles for every season",
      subcategories: [
        {
          id: "men",
          name: "Men",
          items: [
            { id: gid(), name: "Classic Oxford Shirt", desc: "Premium cotton, slim fit, button-down collar", price: "69.00", image: img("tshirt.jpg") },
            { id: gid(), name: "Slim Fit Chinos", desc: "Stretch cotton twill, tapered leg, 5 pockets", price: "59.00", image: img("fashion.jpg") },
            { id: gid(), name: "Leather Bomber Jacket", desc: "Genuine lambskin leather, zip front, ribbed cuffs", price: "299.00", image: img("fashion.jpg"), tag: "Premium" },
            { id: gid(), name: "Cashmere Crew Neck Sweater", desc: "100% Mongolian cashmere, 12gg knit, ribbed hem", price: "189.00", image: img("fashion.jpg") },
            { id: gid(), name: "Sneakers Urban Run", desc: "Breathable mesh, responsive cushioning, gum outsole", price: "89.95", image: img("shoe.jpg") },
          ],
        },
        {
          id: "women",
          name: "Women",
          items: [
            { id: gid(), name: "Linen Blend Dress", desc: "Relaxed fit, V-neck, side pockets, knee length", price: "79.00", image: img("fashion.jpg") },
            { id: gid(), name: "High-Waist Skinny Jeans", desc: "Stretch denim, 5 pockets, ankle length", price: "69.00", image: img("fashion.jpg") },
            { id: gid(), name: "Wool Blend Coat", desc: "Double-breasted, notch lapel, mid-calf length", price: "249.00", image: img("fashion.jpg"), tag: "Winter" },
            { id: gid(), name: "Silk Blouse", desc: "100% mulberry silk, hidden button placket", price: "129.00", image: img("fashion.jpg") },
            { id: gid(), name: "Leather Crossbody Bag", desc: "Full grain leather, adjustable strap, 3 compartments", price: "179.00", image: img("bag.jpg") },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { id: gid(), name: "Aviator Sunglasses", desc: "Polarized UV400 lenses, gold frame, scratch-resistant", price: "149.00", image: img("fashion.jpg") },
            { id: gid(), name: "Minimalist Leather Watch", desc: "Japanese quartz, sapphire crystal, Italian leather strap", price: "199.00", image: img("jewelry.jpg") },
            { id: gid(), name: "Cashmere Scarf", desc: "Pure cashmere, fringed ends, 180x70cm", price: "89.00", image: img("fashion.jpg") },
            { id: gid(), name: "Canvas Backpack", desc: "Waxed canvas, leather base, laptop sleeve up to 15\"", price: "119.00", image: img("backpack.jpg") },
          ],
        },
      ],
    },
    {
      id: "home-kitchen",
      name: "Home & Kitchen",
      image: img("home-kitchen.jpg"),
      desc: "Smart appliances and essentials for daily living",
      subcategories: [
        {
          id: "appliances",
          name: "Appliances",
          items: [
            { id: gid(), name: "Smart Air Fryer 6L", desc: "Digital touch, 12 presets, Wi-Fi enabled, dishwasher-safe", price: "129.00", image: img("home-kitchen.jpg"), tag: "Best Seller" },
            { id: gid(), name: "Espresso Machine Pro", desc: "15-bar pump, PID temp control, dual boiler, steam wand", price: "549.00", image: img("home-kitchen.jpg") },
            { id: gid(), name: "Robot Vacuum X3", desc: "LiDAR navigation, 5000Pa suction, self-empty base, 2h runtime", price: "599.99", image: img("home-kitchen.jpg"), tag: "New" },
            { id: gid(), name: "Stand Mixer 5.5qt", desc: "Die-cast metal, 12 speeds, tilt-head, 550W motor", price: "349.00", image: img("home-kitchen.jpg") },
            { id: gid(), name: "Smart Fridge 28 cu ft", desc: "French door, AI temperature, water/ice dispenser, Wi-Fi", price: "2,499.00", image: img("home-kitchen.jpg") },
          ],
        },
        {
          id: "lighting",
          name: "Lighting & Decor",
          items: [
            { id: gid(), name: "Smart Bulb 4-Pack", desc: "16M colors, white tunable, voice control, no hub needed", price: "39.99", image: img("home-kitchen.jpg"), tag: "Sale" },
            { id: gid(), name: "LED Desk Lamp", desc: "Adjustable color temp 3000-6500K, wireless charging base", price: "79.00", image: img("home-kitchen.jpg") },
            { id: gid(), name: "Wi-Fi LED Strip 5m", desc: "RGBIC, music sync, app + voice control, cuttable", price: "29.99", image: img("home-kitchen.jpg") },
            { id: gid(), name: "Scented Candle Trio", desc: "Soy wax, 200h burn time, vanilla/lavender/sandalwood", price: "34.00", image: img("home-kitchen.jpg") },
          ],
        },
      ],
    },
    {
      id: "sports-outdoors",
      name: "Sports & Outdoors",
      image: img("sports-outdoors.jpg"),
      desc: "Gear for an active lifestyle",
      subcategories: [
        {
          id: "fitness",
          name: "Fitness",
          items: [
            { id: gid(), name: "Adjustable Dumbbells 52.5lb", desc: "Space-saving, 5-52.5 lb range, quick-change dial", price: "349.00", image: img("sports-outdoors.jpg"), tag: "Best Seller" },
            { id: gid(), name: "Yoga Mat Premium 6mm", desc: "Non-slip TPE, alignment lines, carrying strap", price: "49.99", image: img("sports-outdoors.jpg") },
            { id: gid(), name: "Resistance Bands Set", desc: "5 bands 10-50lb, door anchor, ankle straps, carry bag", price: "29.99", image: img("sports-outdoors.jpg") },
            { id: gid(), name: "Jump Rope Speed Pro", desc: "Ball-bearing system, adjustable cable, foam handles", price: "19.95", image: img("sports-outdoors.jpg") },
          ],
        },
        {
          id: "outdoor",
          name: "Outdoor",
          items: [
            { id: gid(), name: "Insulated Water Bottle 1L", desc: "Double-wall vacuum, 24h cold/12h hot, leak-proof", price: "34.95", image: img("sports-outdoors.jpg") },
            { id: gid(), name: "Running Shoes Cloud 6", desc: "Ultralight mesh, Helion foam sole, reflective details", price: "149.99", image: img("sneakers.jpg") },
            { id: gid(), name: "Hiking Backpack 45L", desc: "Waterproof ripstop, ergonomic frame, rain cover included", price: "129.00", image: img("backpack.jpg") },
            { id: gid(), name: "Folding Camping Chair", desc: "Padded armrests, cup holder, 330lb capacity, carry bag", price: "59.99", image: img("sports-outdoors.jpg") },
          ],
        },
      ],
    },
  ],
  info: {
    name: "Urban Store",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, New York, NY 10001",
    hours: "Mon-Sat 9:00-21:00, Sun 10:00-18:00",
    mapsUrl: "",
    currency: "$",
    language: "en",
    about: "Your one-stop shop for electronics, fashion, home, and sports — quality products curated for modern living.",
  },
  theme: {
    bg: "#f0fdf4",
    cardBg: "#ffffff",
    text: "#0f172a",
    muted: "#64748b",
    accent: "#16a34a",
    accentText: "#ffffff",
    border: "#dcfce7",
    pillBg: "#ffffff",
    pillText: "#0f172a",
    pillActiveBg: "#16a34a",
    pillActiveText: "#ffffff",
    font: "Inter",
    radius: "20px",
    showLogo: false,
  },
};

export const SEED_SERVICIOS: CatalogSeed = {
  categories: [
    {
      id: "marketing-growth",
      name: "Marketing & Growth",
      image: img("marketing.jpg"),
      desc: "Data-driven strategies to grow your brand and revenue",
      subcategories: [
        {
          id: "seo",
          name: "SEO & Organic",
          items: [
            { id: gid(), name: "SEO Audit & Strategy", desc: "Full technical audit, competitor analysis, keyword roadmap", price: "1,500", image: img("seo.jpg"), tag: "Popular" },
            { id: gid(), name: "Monthly SEO Retainer", desc: "Ongoing optimization, content strategy, link building, reporting", price: "2,500/mo", image: img("seo.jpg"), tag: "Best Seller" },
            { id: gid(), name: "Local SEO Package", desc: "Google Business Profile, local citations, review management", price: "800/mo", image: img("seo.jpg") },
            { id: gid(), name: "E-commerce SEO", desc: "Product page optimization, structured data, category strategy", price: "3,000/mo", image: img("seo.jpg") },
          ],
        },
        {
          id: "paid-ads",
          name: "Paid Advertising",
          items: [
            { id: gid(), name: "Google Ads Setup & Manage", desc: "Search, Shopping, Display campaigns — 20% of ad spend", price: "1,000+/mo", image: img("marketing.jpg"), tag: "Popular" },
            { id: gid(), name: "Social Media Ads", desc: "Meta, TikTok, LinkedIn ads — creative + targeting + optimization", price: "2,000/mo", image: img("social-media.jpg") },
            { id: gid(), name: "Retargeting Campaign", desc: "Multi-channel retargeting, dynamic ads, conversion tracking", price: "1,200/mo", image: img("marketing.jpg") },
            { id: gid(), name: "Ad Creative Production", desc: "Video + static ads, A/B testing, platform-optimized formats", price: "500/asset", image: img("creative.jpg") },
          ],
        },
        {
          id: "social-media",
          name: "Social Media Management",
          items: [
            { id: gid(), name: "Starter Social Package", desc: "6 posts/week, 2 platforms, monthly report, community mgmt", price: "1,200/mo", image: img("social-media.jpg") },
            { id: gid(), name: "Growth Social Package", desc: "Daily posts, 4 platforms, influencer outreach, Stories + Reels", price: "2,800/mo", image: img("social-media.jpg"), tag: "Best Seller" },
            { id: gid(), name: "Content Creation Add-on", desc: "Professional photography, video editing, graphic design", price: "800/mo", image: img("creative.jpg") },
            { id: gid(), name: "Influencer Campaign Mgmt", desc: "Sourcing, negotiation, briefing, performance tracking", price: "1,500/mo", image: img("social-media.jpg") },
          ],
        },
      ],
    },
    {
      id: "design-branding",
      name: "Design & Branding",
      image: img("design.jpg"),
      desc: "Strategic design that tells your story and captivates your audience",
      subcategories: [
        {
          id: "brand-identity",
          name: "Brand Identity",
          items: [
            { id: gid(), name: "Logo Design", desc: "3 concepts, vector files, color variations, brand guidelines", price: "1,500", image: img("branding.jpg"), tag: "Popular" },
            { id: gid(), name: "Full Brand Identity", desc: "Logo, palette, typography, patterns, templates, full guideline PDF", price: "4,500", image: img("branding.jpg"), tag: "Best Seller" },
            { id: gid(), name: "Brand Strategy Workshop", desc: "2-day facilitated workshop, positioning, messaging, audience", price: "3,000", image: img("branding.jpg") },
            { id: gid(), name: "Visual Identity Refresh", desc: "Update existing brand, new assets, brand book revision", price: "2,500", image: img("branding.jpg") },
            { id: gid(), name: "Packaging Design", desc: "3D mockups, die-cut templates, print-ready files, 3 variants", price: "2,800", image: img("branding.jpg") },
          ],
        },
        {
          id: "web-uiux",
          name: "Web & UI/UX Design",
          items: [
            { id: gid(), name: "Landing Page Design", desc: "Mobile-first, conversion-optimized, Figma source files", price: "2,000", image: img("web-design.jpg"), tag: "Popular" },
            { id: gid(), name: "Full Website Design", desc: "Up to 10 pages, design system, responsive, Figma + prototypes", price: "6,000", image: img("web-design.jpg") },
            { id: gid(), name: "UX Audit & Research", desc: "Heuristic eval, usability testing, user interviews, report", price: "3,500", image: img("design.jpg") },
            { id: gid(), name: "Dashboard UI Design", desc: "Complex data visualization, interactive prototypes, dark mode", price: "5,000", image: img("web-design.jpg") },
            { id: gid(), name: "Design System Setup", desc: "Component library, tokens, docs, Storybook integration", price: "8,000", image: img("design.jpg") },
          ],
        },
      ],
    },
    {
      id: "development",
      name: "Development & Engineering",
      image: img("development.jpg"),
      desc: "Full-stack engineering from MVP to enterprise",
      subcategories: [
        {
          id: "web-dev",
          name: "Web Development",
          items: [
            { id: gid(), name: "Corporate Website", desc: "CMS-based, SEO-optimized, responsive, 5 pages", price: "4,500", image: img("web-design.jpg"), tag: "Popular" },
            { id: gid(), name: "E-commerce Store", desc: "Shopify/Next.js, product mgmt, payments, shipping, 50 products", price: "8,000", image: img("development.jpg") },
            { id: gid(), name: "Custom Web App", desc: "Full-stack React/Node, auth, database, API, 3 months", price: "25,000", image: img("development.jpg") },
            { id: gid(), name: "API Development", desc: "REST/GraphQL, documentation, testing, deployment", price: "6,000", image: img("development.jpg") },
            { id: gid(), name: "Performance Optimization", desc: "CWV audit, lazy loading, caching, CDN setup, 50%+ improvement", price: "2,500", image: img("development.jpg") },
          ],
        },
        {
          id: "mobile",
          name: "Mobile Apps",
          items: [
            { id: gid(), name: "iOS App Development", desc: "Native SwiftUI, App Store submission, 3 months", price: "30,000", image: img("mobile-app.jpg") },
            { id: gid(), name: "Android App Development", desc: "Kotlin/Jetpack Compose, Play Store, 3 months", price: "30,000", image: img("mobile-app.jpg") },
            { id: gid(), name: "Cross-Platform App (RN)", desc: "React Native, iOS + Android, shared codebase, 2 months", price: "20,000", image: img("mobile-app.jpg"), tag: "Popular" },
            { id: gid(), name: "App Maintenance", desc: "Bug fixes, OS updates, performance monitoring, monthly", price: "1,500/mo", image: img("mobile-app.jpg") },
          ],
        },
        {
          id: "cloud-devops",
          name: "Cloud & DevOps",
          items: [
            { id: gid(), name: "Cloud Migration", desc: "AWS/Azure/GCP assessment, migration plan, execution", price: "12,000", image: img("cloud.jpg") },
            { id: gid(), name: "CI/CD Pipeline Setup", desc: "GitHub Actions, automated testing, staging/prod deployment", price: "3,500", image: img("cloud.jpg") },
            { id: gid(), name: "Infrastructure as Code", desc: "Terraform/Pulumi, monitoring, auto-scaling, disaster recovery", price: "6,000", image: img("cloud.jpg") },
            { id: gid(), name: "Managed DevOps Retainer", desc: "24/7 monitoring, incident response, monthly optimization", price: "2,000/mo", image: img("cloud.jpg") },
          ],
        },
      ],
    },
    {
      id: "consulting-strategy",
      name: "Business Consulting",
      image: img("consulting.jpg"),
      desc: "Expert guidance to scale smarter and faster",
      subcategories: [
        {
          id: "strategy",
          name: "Strategy & Operations",
          items: [
            { id: gid(), name: "Business Strategy Session", desc: "4-hour workshop, growth roadmap, KPI framework", price: "2,500", image: img("strategy.jpg") },
            { id: gid(), name: "Go-to-Market Plan", desc: "Market analysis, channel strategy, launch timeline, budget", price: "5,000", image: img("strategy.jpg"), tag: "Popular" },
            { id: gid(), name: "Operations Audit", desc: "Process mapping, bottlenecks, automation opportunities, report", price: "3,500", image: img("consulting.jpg") },
            { id: gid(), name: "Fractional COO Service", desc: "Monthly strategic oversight, team management, OKR tracking", price: "4,000/mo", image: img("consulting.jpg") },
          ],
        },
        {
          id: "analytics",
          name: "Data & Analytics",
          items: [
            { id: gid(), name: "Data Strategy Setup", desc: "Infrastructure, tools, tracking plan, dashboard setup", price: "4,500", image: img("analytics.jpg") },
            { id: gid(), name: "Analytics Audit", desc: "GA4/Plausible audit, data quality, actionable recommendations", price: "2,000", image: img("analytics.jpg") },
            { id: gid(), name: "Custom Dashboard Build", desc: "Live KPIs, automated reports, team access, 5 data sources", price: "3,000", image: img("analytics.jpg") },
            { id: gid(), name: "A/B Testing Program", desc: "Hypothesis creation, experiment design, statistical analysis", price: "2,500/mo", image: img("analytics.jpg") },
          ],
        },
      ],
    },
  ],
  info: {
    name: "Elevate Agency",
    phone: "+1 (555) 987-6543",
    address: "456 Madison Ave, Suite 200, New York, NY 10022",
    hours: "Mon-Fri 9:00-18:00",
    mapsUrl: "",
    language: "en",
    about: "Full-service digital agency — we help brands grow through strategy, design, development, and marketing.",
  },
  theme: {
    bg: "#fafaf9",
    cardBg: "#ffffff",
    text: "#1f2937",
    muted: "#6b7280",
    accent: "#7c3aed",
    accentText: "#ffffff",
    border: "#e5e7eb",
    pillBg: "#ffffff",
    pillText: "#1f2937",
    pillActiveBg: "#7c3aed",
    pillActiveText: "#ffffff",
    font: "Inter",
    radius: "12px",
    showLogo: false,
  },
};

export const SEEDS_BY_KIND: Record<string, CatalogSeed> = {
  restaurant: SEED_CATALOG,
  products: SEED_PRODUCTOS,
  services: SEED_SERVICIOS,
};
