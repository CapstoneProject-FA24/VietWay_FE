export const provinces = [
  { id: 1, name: "Hà Nội", image: "https://cdn.thuvienphapluat.vn/uploads/tintuc/2024/01/06/thanh-pho-ha-noi.jpg" },
  { id: 2, name: "Hồ Chí Minh", image: "https://www.trailsofindochina.com/wp-content/uploads/2017/05/hochiminhcity_header.jpg" },
  { id: 3, name: "Đà Nẵng", image: "https://vcdn1-dulich.vnecdn.net/2022/06/03/cauvang-1654247842-9403-1654247849.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=Swd6JjpStebEzT6WARcoOA" },
  { id: 4, name: "Quảng Ninh", image: "https://iv1cdn.vnecdn.net/dulich/images/web/2022/06/23/mot-vong-quang-ninh-tu-tay-sang-dong-1655985954.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=XuQcg62fZbY0Tjl2xdS6zA" },
  { id: 5, name: "Lâm Đồng", image: "https://ik.imagekit.io/tvlk/blog/2023/01/ho-xuan-huong-da-lat-1.jpg?tr=dpr-2,w-675" },
  { id: 6, name: "Kiên Giang", image: "https://ik.imagekit.io/tvlk/blog/2022/07/dHj0gcod-bai-sao-8.jpg?tr=c-at_max" },
  { id: 7, name: "Lào Cai", image: "https://cdn.tgdd.vn/Files/2021/07/03/1365444/kham-pha-13-dia-diem-du-lich-lao-cai-dep-noi-tieng-202303281656546137.jpg" },
  { id: 8, name: "Quảng Nam", image: "https://toquoc.mediacdn.vn/280518851207290880/2023/9/13/318486b4-c187-40b5-9220-1afe6e4ccf5eb99d0408-1694595766050422505578.jpg" },
  { id: 9, name: "Khánh Hòa", image: "https://media.vneconomy.vn/w800/images/upload/2022/03/22/nhatrangkh.jpeg" },
  { id: 10, name: "Thừa Thiên Huế", image: "https://file1.dangcongsan.vn/data/0/images/2024/04/11/upload_673/hue-imperial-gate-1024x683-754-17016811818591749547652.png" }
];

export const getProvinceById = (id) => {
  return provinces.find(province => province.id === parseInt(id));
};

export const getFilteredProvinces = (filters, sortBy) => {
  let filteredProvinces = [...provinces];

  // Apply filters if needed

  // Apply sorting
  switch (sortBy) {
    case 'name':
      filteredProvinces.sort((a, b) => a.name.localeCompare(b.name));
      break;
    // Add more sorting options if needed
    default:
      break;
  }

  return filteredProvinces;
};

export const getRandomProvinces = (count) => {
  const shuffled = [...provinces].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
