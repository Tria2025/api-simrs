<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

require_once '../config/database.php';
require_once '../helpers/response.php';

$raw   = file_get_contents('php://input');
$input = json_decode($raw, true);
if (!is_array($input)) {
    $input = $_POST;
}

$id              = trim($input['id'] ?? $_GET['id'] ?? '');
$pendaftaran_id  = trim($input['pendaftaran_id'] ?? '');
$dokter_id       = trim($input['dokter_id'] ?? '');
$diagnosa        = trim($input['diagnosa'] ?? '');
$catatan         = trim($input['catatan'] ?? '');
$tanggal         = trim($input['tanggal'] ?? '');

if (empty($id) || empty($diagnosa)) {
    sendResponse('error', 'Id dan Diagnosa wajib diisi', null, 400);
}

$pdo    = getConnection();
$cek    = $pdo->prepare("SELECT id FROM diagnosa WHERE id = ?");
$cek->execute([$id]);
if (!$cek->fetch()) {
    sendResponse('error', 'Data rekam medis tidak ditemukan', null, 404);
}

$stmt   = $pdo->prepare("UPDATE diagnosa SET pendaftaran_id=?, dokter_id=?, diagnosa=?, catatan=?, tanggal=? WHERE id=?");
$stmt->execute([$pendaftaran_id, $dokter_id, $diagnosa, $catatan, $tanggal, $id]);

sendResponse('success', 'Data rekam medis Berhasil diperbarui', [
    'id' => $id,
    'diagnosa' => $diagnosa
], 200);
