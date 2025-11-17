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

// Lấy vị trí hiện tại của người dùng
function locateUser() {
  if (!navigator.geolocation) {
    alert("Trình duyệt không hỗ trợ định vị GPS!");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      console.log("User position:", lat, lng);

      // Zoom đến vị trí người dùng
      map.setView([lat, lng], 15);

      // Thêm marker màu đỏ cho vị trí hiện tại
      const userMarker = L.circleMarker([lat, lng], {
        radius: 10,
        color: "#FF4444",
        fillColor: "#FF0000",
        fillOpacity: 0.7,
        weight: 3,
      }).addTo(map);

      userMarker.bindPopup("📍 Vị trí của bạn").openPopup();
    },
    (err) => {
      console.error(err);
      alert(
        "Không thể lấy vị trí của bạn! Hãy bật GPS hoặc cấp quyền truy cập."
      );
    }
  );
}

loadStations(); // Gọi hàm khi load trang
locateUser();
