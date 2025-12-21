"use client";
import { useEffect, useState } from "react";
import {
  addTask,
  getEmployeesListByJob,
  getProductsUnassigned,
} from "@/lib/api";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from "next/link";
import NoData from "@/components/NoData";
import { useParams } from "next/navigation";
import {
  FaUser,
  FaBoxOpen,
  FaRupeeSign,
  FaTimes,
  FaCheck,
  FaSearch,
} from "react-icons/fa";
import { MdWork, MdAssignmentAdd } from "react-icons/md";
import { cn } from "@/lib/utilty/cn";

export default function EmployeesListTaskBased() {
  const params = useParams();
  const job = params.job;
  const [employees, setEmployees] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [pays, setPays] = useState("");

  const fetchProducts = async (pageNum = page, reset = false) => {
    if (!hasMore || loadingProducts) return;
    setLoadingProducts(true);

    try {
      const res = await getProductsUnassigned(pageNum, job);
      const { products: newProducts, hasMore: more } = res.data;

      setProducts((prev) => (reset ? newProducts : [...prev, ...newProducts]));

      setHasMore(more);
      setPage(pageNum + 1);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to fetch", {
        theme: "colored",
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await getEmployeesListByJob(job);
        setEmployees(empRes.data);

        setHasMore(true);
        await fetchProducts(1, true);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.error || "Failed to fetch", {
          theme: "colored",
        });
      } finally {
        setLoadingPage(false);
      }
    };
    fetchData();
  }, []);

  const handleSelect = (e, empId) => {
    const prodId = e.target.value;
    if (!prodId) return;

    const prod = products.find((p) => p._id === prodId);
    setSelectedProduct(prod);
    setSelectedEmployeeId(empId);
    setPays("");
  };

  const handleAssign = async () => {
    if (!selectedProduct || !pays || !selectedEmployeeId) {
      return toast.error("Fill all fields before assigning");
    }

    try {
      await addTask({
        productId: selectedProduct._id,
        employeeId: selectedEmployeeId,
        pays: Number(pays),
        job,
      });

      toast.success("Task assigned successfully!");

      setSelectedProduct(null);
      setSelectedEmployeeId(null);
      setPays("");

      if (hasMore) {
        // If we have pagination, purely resetting might be safer to ensure consistency
        setProducts([]);
        setHasMore(true);
        setPage(1);
        await fetchProducts(1, true);
      } else {
        // Optimistic update if list is small enough
        setProducts((prev) =>
          prev.filter((p) => p._id !== selectedProduct._id)
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to assign task");
      console.error(error);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedEmployeeId(null);
    setPays("");
  };

  if (loadingPage) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex justify-center items-center text-primary">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl" />
      </div>
    );
  }

  if (!loadingPage && (!employees || employees.length === 0)) {
    return <NoData text={"No employees available"} />;
  }

  return (
    <div className="min-h-full py-8 px-4 md:px-8 bg-background/30">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <div>
            <h1 className="text-3xl font-bold text-text-dark capitalize flex items-center gap-3">
              <MdWork className="text-primary" />
              {job.replace("-", " ")}
              <span className="text-muted-text text-lg font-normal">Tasks</span>
            </h1>
            <p className="text-muted-text mt-1">
              Assign pending products to employees
            </p>
          </div>
          {hasMore && (
            <button
              onClick={() => fetchProducts()}
              disabled={loadingProducts}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm",
                loadingProducts
                  ? "bg-neutral-100 text-muted-text cursor-not-allowed"
                  : "bg-surface border border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40"
              )}
            >
              {loadingProducts ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                <FaBoxOpen />
              )}
              {loadingProducts ? "Loading..." : "Load More Products"}
            </button>
          )}
        </div>

        {/* Employee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((emp, index) => (
            <div
              key={emp._id}
              className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 flex flex-col gap-4 group hover:shadow-md transition-all duration-300 hover:border-primary/20"
            >
              <div className="flex items-center gap-4 border-b border-neutral-50 pb-4">
                <div className="w-12 h-12 rounded-full bg-secondary text-surface flex items-center justify-center font-bold text-lg shadow-sm">
                  {emp.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/dashboard/task-based/${emp._id}`}
                    className="text-lg font-bold text-text-dark hover:text-primary transition-colors truncate block"
                  >
                    {emp.name}
                  </Link>
                  <p className="text-xs text-muted-text uppercase tracking-wider font-semibold">
                    {job.replace("-", " ")}
                  </p>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <label className="text-sm font-semibold text-muted-text flex items-center gap-2">
                  <FaBoxOpen className="text-primary/70" /> Assign Product
                </label>
                <div className="relative">
                  <select
                    onChange={(e) => handleSelect(e, emp._id)}
                    value=""
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all appearance-none cursor-pointer text-text-dark"
                  >
                    <option value="" disabled>
                      Select a product to assign
                    </option>
                    {products.length > 0 ? (
                      products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.productId} —{" "}
                          {new Date(p.createdAt).toLocaleDateString()}
                        </option>
                      ))
                    ) : (
                      <option disabled>No unassigned products</option>
                    )}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-text">
                    <FaSearch />
                  </div>
                </div>
              </div>

              <Link
                href={`/products/add/${emp._id}`}
                className="w-full py-3 rounded-xl border border-dashed border-gray-300 text-muted-text hover:text-primary hover:border-primary hover:bg-primary/5 font-medium transition-all flex items-center justify-center gap-2 mt-2"
              >
                <MdAssignmentAdd />
                Create Specific Task
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Assignment Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-0 overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-secondary p-6 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  Confirm Assignment
                </h2>
                <p className="text-white/60 text-sm">
                  Assigning {selectedProduct.productId} to employee
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Product Details Card */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                <h3 className="text-sm font-bold text-muted-text uppercase tracking-wider mb-2">
                  Product Details
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <p>
                    <span className="text-gray-500">Client:</span>{" "}
                    <span className="font-semibold text-gray-900">
                      {selectedProduct.clientName}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-500">Design No:</span>{" "}
                    <span className="font-semibold text-gray-900">
                      {selectedProduct.designNumber}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-500">Sarees:</span>{" "}
                    <span className="font-semibold text-gray-900">
                      {selectedProduct.numberOfSarees}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-500">Created:</span>{" "}
                    <span className="font-semibold text-gray-900">
                      {new Date(selectedProduct.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>
                <div className="pt-2 mt-2 border-t border-gray-200 flex flex-wrap gap-2">
                  {selectedProduct.windingAssigned && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-medium">
                      Winding Done
                    </span>
                  )}
                  {selectedProduct.markingAssigned && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-md font-medium">
                      Marking Done
                    </span>
                  )}
                  {selectedProduct.chittamAssigned && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-md font-medium">
                      Chittam Done
                    </span>
                  )}
                </div>
              </div>

              {/* Pays Input */}
              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaRupeeSign className="text-primary" />
                  Payment Amount
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg font-semibold"
                  placeholder="Enter amount"
                  value={pays}
                  onChange={(e) => setPays(e.target.value)}
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-2">
                  Enter the amount to be paid for this task.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
                >
                  <FaCheck /> Confirm Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
