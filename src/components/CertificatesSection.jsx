import React, { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';

const CertificatesSection = () => {
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  // WARNING: Do not use client-side authorization in a production application.
  // This check can be easily bypassed by a malicious user.
  // Instead, use Firebase Rules to secure your data.
  const ADMIN_EMAIL = import.meta.env.PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Escuchar cambios en tiempo real de la colección 'certificates'
    const q = query(collection(db, "certificates"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCertificates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return;
    setUploading(true);

    try {
      // WARNING: File uploads should be validated on the server-side (e.g., using Firebase Storage Rules)
      // to ensure that only allowed file types are uploaded.
      // 1. Subir PDF a Firebase Storage
      const storageRef = ref(storage, `certificates/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // WARNING: User-provided input should be sanitized on the server-side
      // before being stored to prevent potential XSS attacks.
      // 2. Guardar referencia en Firestore
      await addDoc(collection(db, "certificates"), {
        title,
        url,
        createdAt: new Date(),
        type: 'pdf'
      });

      setFile(null);
      setTitle('');
      alert('Certificado subido con éxito');
    } catch (error) {
      console.error("Error al subir:", error);
      alert('Error al subir el documento');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Certificados y Capacitaciones Recientes</h2>

      {/* Vista Pública: Lista de Certificados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {certificates.map(cert => (
          <div key={cert.id} className="bg-white border rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <h3 className="font-bold text-xl mb-2 text-gray-800">{cert.title}</h3>
            <a href={cert.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-blue-600 font-semibold hover:underline">
              📄 Ver Certificado (PDF)
            </a>
          </div>
        ))}
      </div>

      {/* Área de Administración */}
      <div className="mt-16 border-t pt-8">
        {!user ? (
          <div className="text-center">
            <button onClick={handleLogin} className="text-gray-400 text-sm hover:text-gray-600 underline">Acceso Admin</button>
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <span className="text-sm text-gray-600">Logueado como: {user.email}</span>
              <button onClick={() => signOut(auth)} className="text-red-500 text-sm font-medium hover:text-red-700">Cerrar Sesión</button>
            </div>

            {user.email === ADMIN_EMAIL ? (
              <form onSubmit={handleUpload} className="space-y-4">
                <h3 className="font-bold text-lg text-gray-800">Subir Nuevo Certificado</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título de la Capacitación</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ej: Curso Avanzado de React"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Archivo PDF</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className={`w-full py-2 px-4 rounded text-white font-bold ${uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {uploading ? 'Subiendo...' : 'Subir Certificado'}
                </button>
              </form>
            ) : (
              <p className="text-red-500 text-center font-bold">No tienes permisos para subir archivos.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CertificatesSection;