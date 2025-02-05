const place = require('../models/place');
const Schedule = require('../models/schedule');
const Transport = require('../models/transport'); // Import model Transport
const express = require('express');
const scheduleRouter = express.Router();

scheduleRouter.post("/addSchedule", async (req, res) => {
    try {
        // Kiểm tra dữ liệu đầu vào
        const { name, departuretime, arrivaltime, transportId, from, to } = req.body;

        if (!name || !departuretime || !arrivaltime || !transportId || !from || !to) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
        }

        // Tìm thông tin phương tiện (transport) theo ID
        const transport = await Transport.findById(transportId);
        if (!transport) {
            return res.status(404).json({ message: "Không tìm thấy phương tiện" });
        }
        
        const fromInSchedule=await place.findById(from)
        if (!fromInSchedule) {
            return res.status(404).json({ message: "Không tìm thấy điểm đi" });
        }
        const toInSchedule=await place.findById(to)
        if (!toInSchedule) {
            return res.status(404).json({ message: "Không tìm thấy điểm đến" });
        }
        // Thiết lập giá mặc định là 0$
        let price = "0$";

        // Kiểm tra điều kiện để gán giá trị
        if (transport.name.toLowerCase() === "bus" && fromInSchedule.name.toLowerCase() === "hanoi" && toInSchedule.name.toLowerCase() === "vinhyen") {
            price = "1$";
        }

        if (transport.name.toLowerCase() === "bus" && fromInSchedule.name.toLowerCase() === "hanoi" && toInSchedule.name.toLowerCase() === "hungyen") {
            price = "2$";
        }

        if (transport.name.toLowerCase() === "mrt" && fromInSchedule.name.toLowerCase() === "hanoi" && toInSchedule.name.toLowerCase() === "hungyen") {
            price = "4$";
        }

        if (transport.name.toLowerCase() === "mrt" && fromInSchedule.name.toLowerCase() === "hanoi" && toInSchedule.name.toLowerCase() === "vinhyen") {
            price = "3$";
        }

        // Tạo một lịch trình mới
        const schedule = new Schedule({
            name,
            departuretime,
            arrivaltime,
            transportId,
            from,
            to,
            price // Gán giá trị price
        });

        // Lưu vào database
        await schedule.save();

        // Lấy danh sách lịch trình để kiểm tra
        const schedulePlace = await Schedule.find().populate('from').populate('to').populate('transportId');

        // Ghi log danh sách lịch trình
        console.log(schedulePlace);

        // Trả về response thành công
        return res.status(201).json({ message: "Thêm lịch trình thành công!", schedule, schedulePlace });
    } catch (error) {
        console.log("Lỗi khi thêm lịch trình:", error);
        return res.status(500).json({ message: "Thêm thất bại", error });
    }
});

module.exports = scheduleRouter;
