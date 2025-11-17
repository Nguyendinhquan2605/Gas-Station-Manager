// Khởi tạo map
const map = L.map("map").setView([21.0285, 105.8542], 12); // Hà Nội

// Thêm tile layer (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

let userLat = null;
let userLng = null;
let routingControl = null;

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
        ${st.address}<br>
        📞 ${st.phone}<br>
        ⏰ Giờ hoạt động: ${st.hours}<br>
        ⛽️ Loại xăng: ${fuelNames || ""}<br>
        🚗 Dịch vụ: ${st.services || ""}<br>
        ⛽ Thương hiệu: ${st.brand || ""}<br>

                <button class="route-button" onclick="getRoute(${st.lat}, ${
          st.lng
        })">
         📍 Chỉ đường
                </button>

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
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;

      console.log("Vị trí user:", userLat, userLng);

      map.setView([userLat, userLng], 15);

      L.circleMarker([userLat, userLng], {
        radius: 10,
        color: "#FF4444",
        fillColor: "#FF0000",
        fillOpacity: 0.7,
      })
        .addTo(map)
        .bindPopup("📍 Vị trí của bạn")
        .openPopup();
    },
    (err) => {
      alert("Không thể lấy vị trí của bạn!");
    }
  );
}

// 6. Hàm vẽ tuyến đường
// =======================
function getRoute(destLat, destLng) {
  if (!userLat || !userLng) {
    alert("Không có vị trí của bạn — hãy bật GPS!");
    return;
  }

  if (routingControl) map.removeControl(routingControl);

  routingControl = L.Routing.control({
    waypoints: [L.latLng(userLat, userLng), L.latLng(destLat, destLng)],
    lineOptions: { weight: 6, addWaypoints: false },
    draggableWaypoints: false,
    createMarker: () => null,
  }).addTo(map);
}

loadStations(); // Gọi hàm khi load trang
locateUser();
