// Chỉ chạy code sau khi toàn bộ trang đã được tải xong
document.addEventListener('DOMContentLoaded', function() {

    // ===================================================================
    // 1. DỮ LIỆU TRUNG TÂM VÀ CÁC BIẾN
    // ===================================================================
    
    // Dữ liệu sản phẩm mẫu (dùng chung cho toàn bộ trang web)
    const duLieuSanPham = {
        'sp01': { ten: 'Máy Xay Sinh Tố Đa Năng', gia: 890000, hinhAnh: 'image/spmayxay.png' },
        'sp02': { ten: 'Nồi Cơm Điện Tử', gia: 1250000, hinhAnh: 'image/spnoicom.png' },
        'sp03': { ten: 'Robot Hút Bụi Lau Nhà Pro', gia: 4500000, hinhAnh: 'image/sprobot.png' },
        'sp04': { ten: 'Nồi Chiên Không Dầu 5L', gia: 1790000, hinhAnh: 'image/spnoichienkhongdau.png' }
    };

    // ===================================================================
    // 2. CÁC HÀM QUẢN LÝ GIỎ HÀNG (Sử dụng localStorage)
    // ===================================================================

    function layGioHang() {
        return JSON.parse(localStorage.getItem('gioHang')) || [];
    }

    function luuGioHang(gioHang) {
        localStorage.setItem('gioHang', JSON.stringify(gioHang));
        capNhatSoLuongIcon();
    }

    // ===================================================================
    // 3. CÁC HÀM CẬP NHẬT VÀ HIỂN THỊ GIAO DIỆN
    // ===================================================================

    function capNhatSoLuongIcon() {
        const gioHang = layGioHang();
        const iconSoLuong = document.getElementById('so-luong-trong-gio');
        if (iconSoLuong) {
            iconSoLuong.innerText = gioHang.reduce((tong, item) => tong + item.soLuong, 0);
        }
    }

    function hienThiSanPham() {
        const khuVucHienThi = document.getElementById('khu-vuc-san-pham-moi') || document.getElementById('khu-vuc-san-pham-danhmuc');
        if (!khuVucHienThi) return;

        khuVucHienThi.innerHTML = '';
        for (const id in duLieuSanPham) {
            const sanPham = duLieuSanPham[id];
            const sanPhamDiv = document.createElement('div');
            sanPhamDiv.classList.add('mot-san-pham');
            sanPhamDiv.innerHTML = `
                <a href="chitiet.html?id=${id}">
                    <img src="${sanPham.hinhAnh}" alt="${sanPham.ten}">
                    <h4>${sanPham.ten}</h4>
                    <p class="gia">${sanPham.gia.toLocaleString('vi-VN')}đ</p>
                </a>
                <button class="nut-them-vao-gio" data-id="${id}">Thêm vào giỏ</button>
            `;
            khuVucHienThi.appendChild(sanPhamDiv);
        }
    }

    function hienThiTrangGioHang() {
        const thanBang = document.getElementById('than-bang-gio-hang');
        if (!thanBang) return; 

        const gioHang = layGioHang();
        const tongTienEl = document.getElementById('tong-tien-gio-hang');
        const khuVucThongBaoTrong = document.getElementById('thong-bao-gio-hang-trong');
        const khuVucGioHangChinh = document.getElementById('khu-vuc-gio-hang');

        if (gioHang.length === 0) {
            khuVucThongBaoTrong.style.display = 'block';
            khuVucGioHangChinh.querySelector('.bang-gio-hang').style.display = 'none';
            khuVucGioHangChinh.querySelector('.tong-ket-gio-hang').style.display = 'none';
            return;
        }

        khuVucThongBaoTrong.style.display = 'none';
        khuVucGioHangChinh.querySelector('.bang-gio-hang').style.display = 'table';
        khuVucGioHangChinh.querySelector('.tong-ket-gio-hang').style.display = 'block';

        thanBang.innerHTML = '';
        let tongTien = 0;

        gioHang.forEach(item => {
            const sanPham = duLieuSanPham[item.id];
            if (!sanPham) return; 
            const thanhTien = sanPham.gia * item.soLuong;
            tongTien += thanhTien;

            const dong = document.createElement('tr');
            dong.innerHTML = `
                <td class="cot-san-pham">
                    <div class="thong-tin-item">
                        <img src="${sanPham.hinhAnh}" alt="${sanPham.ten}">
                        <span>${sanPham.ten}</span>
                    </div>
                </td>
                <td>${sanPham.gia.toLocaleString('vi-VN')}đ</td>
                <td><input type="number" class="so-luong-item" value="${item.soLuong}" min="1" data-id="${item.id}"></td>
                <td>${thanhTien.toLocaleString('vi-VN')}đ</td>
                <td><button class="nut-xoa-item" data-id="${item.id}">&times;</button></td>
            `;
            thanBang.appendChild(dong);
        });

        tongTienEl.innerText = tongTien.toLocaleString('vi-VN') + 'đ';
    }
    
    function hienThiTrangThanhToan() {
        const khuVucDonHang = document.getElementById('danh-sach-san-pham-don-hang');
        if (!khuVucDonHang) return;

        const gioHang = layGioHang();
        const tongTienEl = document.getElementById('tong-tien-don-hang');
        let tongTien = 0;

        khuVucDonHang.innerHTML = '';
        gioHang.forEach(item => {
            const sanPham = duLieuSanPham[item.id];
            const thanhTien = sanPham.gia * item.soLuong;
            tongTien += thanhTien;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item-don-hang');
            itemDiv.innerHTML = `
                <img src="${sanPham.hinhAnh}" alt="${sanPham.ten}">
                <span>${sanPham.ten} (x${item.soLuong})</span>
                <strong>${thanhTien.toLocaleString('vi-VN')}đ</strong>
            `;
            khuVucDonHang.appendChild(itemDiv);
        });

        tongTienEl.innerText = tongTien.toLocaleString('vi-VN') + 'đ';
    }

    // ===================================================================
    // 4. GÁN CÁC SỰ KIỆN (EVENT LISTENERS)
    // ===================================================================

    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('nut-them-vao-gio')) {
            const idSanPham = event.target.getAttribute('data-id');
            const gioHang = layGioHang();
            const itemDaCo = gioHang.find(item => item.id === idSanPham);

            if (itemDaCo) {
                itemDaCo.soLuong++;
            } else {
                gioHang.push({ id: idSanPham, soLuong: 1 });
            }
            luuGioHang(gioHang);
            alert(`Đã thêm "${duLieuSanPham[idSanPham].ten}" vào giỏ hàng!`);
        }

        if (event.target.classList.contains('nut-xoa-item')) {
            const idSanPham = event.target.getAttribute('data-id');
            let gioHang = layGioHang();
            gioHang = gioHang.filter(item => item.id !== idSanPham);
            luuGioHang(gioHang);
            hienThiTrangGioHang();
        }
    });

    document.body.addEventListener('change', function(event) {
        if (event.target.classList.contains('so-luong-item')) {
            const idSanPham = event.target.getAttribute('data-id');
            const soLuongMoi = parseInt(event.target.value);
            const gioHang = layGioHang();
            const itemCanCapNhat = gioHang.find(item => item.id === idSanPham);

            if (itemCanCapNhat && soLuongMoi > 0) {
                itemCanCapNhat.soLuong = soLuongMoi;
                luuGioHang(gioHang);
                hienThiTrangGioHang();
            }
        }
    });

    const nutHoanTat = document.getElementById('nut-hoan-tat-don-hang');
    if (nutHoanTat) {
        nutHoanTat.addEventListener('click', function() {
            const hoTen = document.getElementById('ho-ten').value;
            if (!hoTen) {
                alert('Vui lòng nhập đầy đủ thông tin giao hàng!');
                return;
            }
            alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.');
            localStorage.removeItem('gioHang');
            window.location.href = 'trangchu.html';
        });
    }

    // ===================================================================
    // 5. KHỞI TẠO KHI TẢI TRANG
    // ===================================================================

    capNhatSoLuongIcon();
    hienThiSanPham();
    hienThiTrangGioHang();
    hienThiTrangThanhToan();

});