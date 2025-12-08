//Edit station
async function submitForm(event) {
  event.preventDefault(); // chặn submit mặc định

  const form = event.target;
  const actionUrl = form.dataset.action; // lấy URL riêng của form

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

  const response = await fetch(actionUrl, {
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

// Delete Brand
const buttonsDelete_Brand = document.querySelectorAll("[button-delete-brand]");
if (buttonsDelete_Brand.length > 0) {
  buttonsDelete_Brand.forEach((button) => {
    button.addEventListener("click", async () => {
      const isConfirm = confirm("Bạn có chắc chắn muốn xóa thương hiệu này!");

      if (isConfirm) {
        const id = button.getAttribute("button-id");
        try {
          const response = await fetch(`/admin/brands/delete/${id}`, {
            method: "DELETE",
          });

          const result = await response.json();
          const code = result.code;
          if (code == 200) {
            alert("Xóa thương hiệu thành công!");
            window.location.href = "/admin/brands";
          } else {
            alert("Lỗi!");
          }
        } catch (error) {
          console.log(error);
          alert("Không thể xóa thương hiệu!");
        }
      }
    });
  });
}

// Delete FuelTypes
const buttonsDelete_Fuel = document.querySelectorAll("[button-delete-fuel]");
if (buttonsDelete_Fuel.length > 0) {
  buttonsDelete_Fuel.forEach((button) => {
    button.addEventListener("click", async () => {
      const isConfirm = confirm("Bạn có chắc chắn muốn xóa nhiên liệu này!");

      if (isConfirm) {
        const id = button.getAttribute("button-id");
        try {
          const response = await fetch(`/admin/fuel_types/delete/${id}`, {
            method: "DELETE",
          });

          const result = await response.json();
          const code = result.code;
          if (code == 200) {
            alert("Xóa nhiên liệu thành công!");
            window.location.href = "/admin/fuel_types";
          } else {
            alert("Lỗi!");
          }
        } catch (error) {
          console.log(error);
          alert("Không thể xóa nhiên liệu!");
        }
      }
    });
  });
}

document.querySelectorAll("form[data-action]").forEach((form) => {
  form.addEventListener("submit", submitForm);
});
