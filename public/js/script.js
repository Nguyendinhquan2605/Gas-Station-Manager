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
// Hàm load dữ liệu từ API và hiển thị marker + danh sách
async function loadStations() {
  try {
    const res = await fetch("/stations/station-data");
    const stations = await res.json();

    stations.forEach((st) => {
      if (st.lat && st.lng) {
        const marker = L.marker([st.lat, st.lng]).addTo(map);

        // Danh sách nhiên liệu
        const fuelNames = st.FuelTypes.map((f) => f.fuel_name).join(", ");

        // Gắn popup cho marker
        marker.bindPopup(`
          <b>${st.name}</b><br>
          ${st.address}<br>
          📞 ${st.phone}<br>
          ⏰ Giờ hoạt động: ${st.hours}<br>
          ⛽ Loại xăng: ${fuelNames || ""}<br>
          🚗 Dịch vụ: ${st.services || ""}<br>
          🏪 Thương hiệu: ${st.brand.name || ""}<br>

          <button class="route-button"
            data-lat="${st.lat}"
            data-lng="${st.lng}">
            📍 Chỉ đường
          </button>
        `);

        // Tooltip tên cây xăng
        marker.bindTooltip(st.name, {
          permanent: true,
          direction: "top",
          offset: [0, -10],
          className: "station-label",
        });

        // GẮN SỰ KIỆN popupopen TẠI ĐÂY
        marker.on("popupopen", function () {
          const btn = document.querySelector(".route-button");
          if (!btn) return;

          const lat = parseFloat(btn.getAttribute("data-lat"));
          const lng = parseFloat(btn.getAttribute("data-lng"));

          btn.addEventListener("click", () => {
            getRoute(lat, lng);
          });
        });

        // ====== THÊM VÀO ĐỂ RENDER STATION LIST ======
        const listContainer = document.getElementById("station-list");

        const stationItem = document.createElement("div");
        stationItem.classList.add("station-item");

        stationItem.innerHTML = `
           <h3>${st.name}</h3>
           <p><b>Địa chỉ:</b> ${st.address}</p>
           <p><b>⛽Nhiên liệu:</b> ${fuelNames}</p>
           <p><b>🚗Dịch vụ:</b> ${st.services || "Không rõ"}</p>
           <p><b>🏪Thương hiệu:</b> ${st.brand.name}</p>
         
           <button class="view-map-btn"
             data-lat="${st.lat}"
             data-lng="${st.lng}">
             📍 Xem trên bản đồ
           </button>
        `;

        listContainer.appendChild(stationItem);

        // ========== SỰ KIỆN XEM TRÊN BẢN ĐỒ ==========
        stationItem
          .querySelector(".view-map-btn")
          .addEventListener("click", () => {
            map.setView([st.lat, st.lng], 17);
            marker.openPopup();
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
  // Đóng popup ngay khi ấn nút chỉ đường
  map.closePopup();

  if (!userLat || !userLng) {
    alert("Không có vị trí của bạn — hãy bật GPS!");
    return;
  }

  if (routingControl) map.removeControl(routingControl);

  routingControl = L.Routing.control({
    waypoints: [L.latLng(userLat, userLng), L.latLng(destLat, destLng)],
    lineOptions: { weight: 8, addWaypoints: false },
    draggableWaypoints: false,
    createMarker: () => null,
  }).addTo(map);

  //  LẤY QUÃNG ĐƯỜNG Ở ĐÂY
  routingControl.on("routesfound", function (e) {
    const summary = e.routes[0].summary;

    const distanceKm = (summary.totalDistance / 1000).toFixed(2);
    // const timeMin = Math.round(summary.totalTime / 60);

    // 1. Lấy toàn bộ điểm của tuyến đường
    const points = e.routes[0].coordinates;

    // 2. Lấy điểm giữa (midpoint)
    const midIndex = Math.floor(points.length / 2);
    const midPoint = points[midIndex];

    // Nếu marker của thông tin đã tồn tại thì xóa
    if (window.routeInfoMarker) {
      map.removeLayer(window.routeInfoMarker);
    }

    // 3. Tạo marker trong suốt để hiện tooltip
    window.routeInfoMarker = L.marker([midPoint.lat, midPoint.lng], {
      opacity: 0, // ẩn icon marker
    }).addTo(map);

    // 4. Gắn tooltip luôn hiển thị
    window.routeInfoMarker
      .bindTooltip(`📏 ${distanceKm} km<br>`, {
        permanent: true,
        direction: "top",
        offset: [0, -10],
        className: "route-info-tooltip",
      })
      .openTooltip();
  });
}

function clearRoute() {
  if (routingControl) {
    map.removeControl(routingControl);
    routingControl = null;
  }
  map.closePopup();
}

loadStations(); // Gọi hàm khi load trang
locateUser();
