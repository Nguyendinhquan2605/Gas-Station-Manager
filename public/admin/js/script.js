//Edit station
async function submitForm(event) {
  event.preventDefault(); // chặn submit mặc định

  const form = document.getElementById("gasStationForm");
  const formData = new FormData(form);

  // Convert FormData → JSON
  const data = {};
  formData.forEach((value, key) => {
    // fuel_id[] → array
    if (key === "fuel_id[]") {
      if (!data.fuel_id) data.fuel_id = [];
      data.fuel_id.push(parseInt(value));
    } else {
      data[key] = value;
    }
  });

  const stationId = form.getAttribute("data-id");

  const response = await fetch(`/admin/stations/edit/${stationId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const dataPatch = await response.json();

  if (dataPatch.redirect) {
    window.location.href = dataPatch.redirect;
  }
  alert("Cập nhật thành công!");
}

//Delete station
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
  buttonsDelete.forEach((button) => {
    button.addEventListener("click", async () => {
      const isConfirm = confirm("Bạn có chắc chắn muốn xóa cây xăng này!");

      if (isConfirm) {
        const id = button.getAttribute("button-id");
        try {
          const response = await fetch(`/admin/stations/delete/${id}`, {
            method: "DELETE",
          });

          const result = await response.json();
          const code = result.code;
          if (code == 200) {
            alert("Xóa cây xăng thành công!");
            window.location.href = "/admin/Alls-stations";
          } else {
            alert("Lỗi!");
          }
        } catch (error) {
          console.log(error);
          alert("Không thể xóa cây xăng!");
        }
      }
    });
  });
}
