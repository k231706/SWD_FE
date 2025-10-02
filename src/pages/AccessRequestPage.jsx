import React, { useState, useEffect } from "react";
import { useLabStore, useAuthStore } from "../store";
import {
  Key,
  Clock,
  CheckCircle,
  MapPin,
  User,
  Send
} from "lucide-react";
import "../styles/AccessRequestPage.css";

export const AccessRequestPage = () => {
  const { user } = useAuthStore();
  const { labs, fetchLabs } = useLabStore();

  const [accessRequests, setAccessRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [newRequest, setNewRequest] = useState({
    labId: "",
    requestType: "urgent_open",
    reason: "",
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  useEffect(() => {
    fetchLabs();
    mockFetchAccessRequests();
  }, [fetchLabs]);

  const mockFetchAccessRequests = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockRequests = [
      {
        id: "1",
        labId: "1",
        requesterId: "2",
        requestType: "urgent_open",
        reason: "Sinh viên cần vào lab để lấy đồ án, cửa chưa mở đúng giờ",
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        labId: "2",
        requesterId: "3",
        requestType: "urgent_close",
        reason: "Phát hiện máy tính chưa tắt, cần vào tắt để đảm bảo an toàn",
        status: "in_progress",
        securityGuardId: "4",
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
    ];

    setAccessRequests(mockRequests);
    setIsLoading(false);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!newRequest.labId || !newRequest.reason.trim()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const request = {
      id: Date.now().toString(),
      labId: newRequest.labId,
      requesterId: user?.id || "",
      requestType: newRequest.requestType,
      reason: newRequest.reason,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setAccessRequests((prev) => [request, ...prev]);
    setNewRequest({ labId: "", requestType: "urgent_open", reason: "" });
    setIsLoading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview((prev) => [...prev, e.target.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAcceptRequest = (id) => {
    setAccessRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "in_progress", securityGuardId: user?.id } : r
      )
    );
  };

  const handleCompleteRequest = (id) => {
    setAccessRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "completed", resolvedAt: new Date().toISOString() } : r
      )
    );
  };

  const RequestCard = ({ request }) => {
    const lab = labs.find((l) => l.id === request.labId);
    const isSecurityGuard = user?.role === "security_guard";
    const canHandle =
      isSecurityGuard &&
      (request.status === "pending" ||
        (request.status === "in_progress" && request.securityGuardId === user?.id));

    return (
      <div className="request-card">
        <div className="request-header">
          <Key className="icon" />
          <h3>{request.requestType === "urgent_open" ? "Mở cửa khẩn cấp" : "Đóng cửa khẩn cấp"}</h3>
          <span className={`status ${request.status}`}>{request.status}</span>
        </div>
        <div className="request-info">
          <p className="inline-icon"><MapPin className="icon-sm" /> {lab?.name} - {lab?.location}</p>
          <p className="inline-icon"><User className="icon-sm" /> Người yêu cầu: {request.requesterId}</p>
          <p className="inline-icon"><Clock className="icon-sm" /> {new Date(request.createdAt).toLocaleString("vi-VN")}</p>
        </div>
        <div className="reason">
          <strong>Lý do:</strong>
          <p className="reason-description">{request.reason}</p>
        </div>
        {canHandle && (
          <div className="actions">
            {request.status === "pending" && (
              <button onClick={() => handleAcceptRequest(request.id)} disabled={isLoading} className="btn btn-blue">
                <CheckCircle className="icon-sm" /> Nhận xử lý
              </button>
            )}
            {request.status === "in_progress" && request.securityGuardId === user?.id && (
              <button onClick={() => handleCompleteRequest(request.id)} disabled={isLoading} className="btn btn-green">
                <CheckCircle className="icon-sm" /> Hoàn thành
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="title">Yêu cầu mở/đóng cửa khẩn cấp</h1>
        <p className="header-subtitle">Gửi yêu cầu mở hoặc đóng cửa lab trong trường hợp khẩn cấp</p>
      </div>

      {showSuccess && (
        <div className="alert success">
          <CheckCircle className="icon-sm" />
          <span>Yêu cầu đã được gửi thành công!</span>
        </div>
      )}

      <div className="layout">
        <div className="form-section">
          <h3 style={{ marginTop: "0" }}>Yêu cầu mở cửa</h3>
          <form onSubmit={handleSubmitRequest}>
            <div className="form-group">
              <label>Chọn phòng Lab</label>
              <select
                value={newRequest.labId}
                onChange={(e) => setNewRequest({ ...newRequest, labId: e.target.value })}
                required
              >
                <option value="">Chọn phòng lab...</option>
                {labs.map((lab) => (
                  <option key={lab.id} value={lab.id}>
                    {lab.name} - {lab.location}
                  </option>
                ))}
              </select>

              <label style={{ marginTop: "5px" }}>Loại yêu cầu</label>
              <select
                value={newRequest.requestType}
                onChange={(e) => setNewRequest({ ...newRequest, requestType: e.target.value })}
              >
                <option value="urgent_open">Mở cửa khẩn cấp</option>
                <option value="urgent_close">Đóng cửa khẩn cấp</option>
              </select>

              <label style={{ marginTop: "5px" }}>Lý do</label>
              <textarea
                rows="4"
                value={newRequest.reason}
                onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                placeholder="Mô tả lý do..."
                required
              />

              <button type="submit" className="btn btn-orange" disabled={isLoading}>
                {isLoading ? "Đang gửi..." : <><Send className="icon-sm" /> Gửi yêu cầu</>}
              </button>
            </div>
          </form>

          {user?.role === "security_guard" && (
            <div className="upload-section">
              <label>Upload hình ảnh</label>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
              <div className="preview-grid">
                {imagePreview.map((src, i) => (
                  <img key={i} src={src} alt={`preview-${i}`} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="list-section">
          <h3 style={{ marginTop: "0" }}>Danh sách yêu cầu ({accessRequests.length})</h3>
          {accessRequests.length === 0 ? (
            <div className="empty">
              <Key className="icon-lg" />
              <p>Chưa có yêu cầu nào</p>
            </div>
          ) : (
            accessRequests.map((r) => <RequestCard key={r.id} request={r} />)
          )}
        </div>
      </div>
    </div>
  );
};
