// Khởi tạo map
const map = L.map("map").setView([21.0285, 105.8542], 12); // Hà Nội

// Thêm tile layer (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Hàm load dữ liệu từ API
async function loadStations() {
  try {
    const res = await fetch("/stations/station-data"); // Gọi API backend
    const stations = await res.json(); // Parse JSON

    // Hiển thị marker
    stations.forEach((st) => {
      if (st.lat && st.lng) {
        const marker = L.marker([st.lat, st.lng]).addTo(map);

        // Lấy danh sách nhiên liệu
        const fuelNames = st.FuelTypes.map((f) => f.fuel_name).join(", ");

        marker.bindPopup(`
                <b>${st.name}</b><br>
                Địa chỉ: ${st.address || "Không có địa chỉ"}<br>
                <b>Loại xăng dầu:</b> ${fuelNames} <br>
                <b>Thương hiệu:</b> ${st.brand.name || "N/A"}<br>
                <b>Giờ mở cửa:</b> ${st.hours || "Chưa rõ"}<br>
                <b>Dịch vụ:</b> ${st.services || "Chưa rõ"}
              `);

        marker.bindTooltip(st.name, {
          permanent: true, // luôn hiển thị, không cần hover
          direction: "top", // vị trí hiển thị phía trên marker
          offset: [0, -10],
          className: "station-label",
        });
      }
    });
  } catch (err) {
    console.error("Lỗi khi tải dữ liệu:", err);
  }
}

loadStations(); // Gọi hàm khi load trang
