import blueShirt from "../assets/Blue shirt.jpg";
import greenDress from "../assets/green dress.jpg";
import jacket from "../assets/jacket.jpg";
import miniSkirt from "../assets/miniskirt.jpg";
import sunDress from "../assets/sundress xinh.jpg";
import brownShoes from "../assets/brown shoes.jpg";
import highHeels from "../assets/highheels.jpg";
import neckLace from "../assets/neckLace.jpg";
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
  {
    id: 6,
    name: "Giày da màu nâu sẫm",
    price: 120000,
    image: brownShoes,
    description: "Giày da nâu sang trọng, thanh lịch cho các quý ông",
    stock: 432,
    categoryId: 3,
  },
  {
    id: 7,
    name: "Cao gót đỏ 10cm",
    price: 1200000,
    image: highHeels,
    description: "Giày cao gót đỏ giúp hack chiều cao, xinh đẹp và trẻ trung",
    stock: 42,
    categoryId: 3,
  },
  {
    id: 8,
    name: "Vòng cổ cá tính mạ vàng",
    price: 100000,
    image: neckLace,
    description: "Vòng cổ mặt chữ nhật xinh cho các nàng",
    stock: 54,
    categoryId: 4,
  },
];

export default products;
