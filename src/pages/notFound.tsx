import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white px-4 text-center text-gray-800">
      <h1 className="text-2xl font-bold tracking-tight">404</h1>
      <p className="mt-4 text-lg text-gray-500">Oops! The page you’re looking for doesn’t exist.</p>

      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-md bg-black px-3 py-1 text-white transition-colors hover:bg-gray-800"
        >
          <ArrowLeft className="p-1" />
          Go back home
        </Link>
      </div>
    </div>
  );
}
