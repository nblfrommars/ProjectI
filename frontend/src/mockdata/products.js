import blueShirt from "../assets/Blue shirt.jpg";
import greenDress from "../assets/green dress.jpg";
import jacket from "../assets/jacket.jpg";
import miniSkirt from "../assets/miniskirt.jpg";
import sunDress from "../assets/sundress xinh.jpg";
const products = [
  {
    id: 1,
    name: "Áo sơ mi xanh cho nam",
    price: 200000,
    image: blueShirt,
    description:
      "Áo sơ mi xanh biển đẹp và sang chảnh, phù hợp với các quý ông lịch lãm và cá tính",
    stock: 100,
    categoryId: 1,
  },
  {
    id: 2,
    name: "Váy xanh sang trọng",
    price: 1000000,
    image: greenDress,
    description:
      " Váy form rộng, tạo độ nữ tính và xinh đẹp bồng bềnh cho các nàng",
    stock: 200,
    categoryId: 2,
  },
  {
    id: 3,
    name: "Jacket thu đông Hàn Quốc",
    price: 1500000,
    image: jacket,
    description: "Phong cách Ulzzang, phù hợp cho các Kpop fan",
    stock: 400,
    categoryId: 1,
  },
  {
    id: 4,
    name: "Mini Skirt cá tính",
    price: 200000,
    image: miniSkirt,
    description:
      " Một chút quyến rũ và phá cách đến từ nhà tạo mẫu Huy Quang, hãy để mùa đông trở nên rực lửa cùng Gloway",
    stock: 233,
    categoryId: 2,
  },
  {
    id: 5,
    name: "Sundress xinh dáng chuẩn",
    price: 400000,
    image: sunDress,
    description:
      "Xinh đẹp và ngọt ngào như hoa mặt trời, hãy cùng Gloway đi giữa trời rực rỡ cùng siêu phẩm Sundress 2025 nhé!",
    stock: 444,
    categoryId: 2,
  },
];

export default products;
