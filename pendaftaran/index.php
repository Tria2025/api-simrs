<?php
header('Access-Control-Allow-Origin: *');
require_once '../config/database.php';
require_once '../helpers/response.php';

$id     = $_GET['id'] ?? null;
$pdo    = getConnection();

if ($id) {
    $stmt   = $pdo->prepare("SELECT * FROM pendaftaran WHERE id = ?");
    $stmt->execute([$id]);
    $data   = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$data) {
        sendResponse('error', 'Data pendaftaran tidak ditemukan', null, 404);
    }
    sendResponse('success', 'Data pendaftaran ditemukan', $data);
} else {
    $stmt   = $pdo->query("SELECT * FROM pendaftaran ORDER BY id ASC");
    $data   = $stmt->fetchAll(PDO::FETCH_ASSOC);
    sendResponse('success', 'Daftar pendaftaran berhasil diambil', $data);
}
