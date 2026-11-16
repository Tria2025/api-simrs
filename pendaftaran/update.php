<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

require_once '../config/database.php';
require_once '../helpers/response.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$raw   = file_get_contents('php://input');
$input = json_decode($raw, true);
if (!is_array($input)) {
    $input = $_POST;
}

$id                 = trim($input['id'] ?? $_GET['id'] ?? '');
$pasien_id          = trim($input['pasien_id'] ?? '');
$jadwal_id          = trim($input['jadwal_id'] ?? '');
$tanggal_kunjungan  = trim($input['tanggal_kunjungan'] ?? '');
$no_antrian         = trim($input['no_antrian'] ?? '');
$status             = trim($input['status'] ?? '');

if (empty($id) || empty($pasien_id)) {
    sendResponse('error', 'Id dan Pasien wajib diisi', null, 400);
}

$pdo    = getConnection();
$cek    = $pdo->prepare("SELECT id FROM pendaftaran WHERE id = ?");
$cek->execute([$id]);
if (!$cek->fetch()) {
    sendResponse('error', 'Data pendaftaran tidak ditemukan', null, 404);
}

$stmt   = $pdo->prepare("UPDATE pendaftaran SET pasien_id=?, jadwal_id=?, tanggal_kunjungan=?, no_antrian=?, status=? WHERE id=?");
$stmt->execute([$pasien_id, $jadwal_id, $tanggal_kunjungan, $no_antrian, $status, $id]);

sendResponse('success', 'Data Pendaftaran Berhasil diperbarui', [
    'id' => $id,
    'pasien_id' => $pasien_id
], 200);
