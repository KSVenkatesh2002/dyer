"use client";
import { useEffect, useMemo, useState } from "react";
import { getAllClients } from "@/lib/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BiSolidTrafficCone } from "react-icons/bi";
import { GiNails, GiTakeMyMoney } from "react-icons/gi";
import { PiNumberEightLight, PiMapPinSimpleAreaFill } from "react-icons/pi";
import {
  MdOutlineRepeat,
  MdDriveFileRenameOutline,
  MdCheckCircle,
} from "react-icons/md";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { LuTally5 } from "react-icons/lu";
import { IoIosPerson } from "react-icons/io";
import { RiLayout3Fill } from "react-icons/ri";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function ProductForm({
  onSubmit,
  initialValues = {},
  hidePays = false,
  showPopup = false,
  employeeId = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [clientLoading, setClientLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productId, setProductId] = useState(false);
  const [form, setForm] = useState({
    clientId: "",
    sariSection: "body",
    // measurements
    nailsCount: 0,
    conesUsed: 0,
    kolukkulu: 0,
    varasalu: 0,
    repeat: 0,
    sareesCount: 0,
    // design info
    designName: "",
    repeatType: "Airplane",
    borderInches: "4",
    pays: 0,
    ...initialValues,
  });

  useEffect(() => {
    getAllClients()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setForm((prev) => ({ ...prev, clientId: res.data[0]._id }));
          setClients(res.data);
        }
      })
      .catch((error) => {
        toast.error(
          error?.response?.data?.error || "Error fetching client list"
        );
        console.error(error);
      })
      .finally(() => setClientLoading(false));
  }, []);

  const vaatam = useMemo(() => {
    const { varasalu, kolukkulu, conesUsed, nailsCount, sareesCount } = form;

    const v = Number(varasalu);
    const k = Number(kolukkulu);
    const c = Number(conesUsed);
    const n = Number(nailsCount);
    const s = Number(sareesCount);

    if (s === 0) return 0;
    return (v * k * c * n) / s;
  }, [
    form.varasalu,
    form.kolukkulu,
    form.conesUsed,
    form.nailsCount,
    form.sareesCount,
  ]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newId = await onSubmit(form);
      setProductId(newId);
      if (showPopup) {
        setIsOpen(true);
      } else {
        // If no popup logic, maybe redirect logic handled by parent or just reset?
        // Current wrapper pages handle toasts.
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Error submitting form");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const InputGroup = ({
    label,
    name,
    type = "number",
    icon: Icon,
    value,
    onChange,
    options = null,
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700 capitalize flex items-center gap-2">
        {Icon && (
          <Icon
            className={`text-lg text-primary ${
              label === "Kolukkulu" ? "rotate-90" : ""
            }`}
          />
        )}
        {label}
      </label>
      <div className="relative">
        {options ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all cursor-pointer appearance-none text-gray-700 font-medium"
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
          />
        )}
      </div>
    </div>
  );

  const SectionHeader = ({ title }) => (
    <div className="col-span-full mb-4 mt-2 pb-2 border-b border-gray-100">
      <h3 className="text-lg font-bold text-secondary">{title}</h3>
    </div>
  );

  const Popup = ({ onClose, employeeId }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6 text-center transform transition-all scale-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
          <MdCheckCircle className="text-3xl" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            Task Assigned!
          </h2>
          <p className="text-gray-500">
            Product ID:{" "}
            <span className="font-mono font-bold text-gray-800">
              {String(productId).substring(0, 8)}...
            </span>
          </p>
        </div>

        <p className="text-gray-600">
          Would you like to assign another task to this employee?
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onClose}
            className="w-full py-3 bg-secondary text-white font-bold rounded-xl shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all"
          >
            Yes, Add Another
          </button>

          {employeeId && (
            <Link
              href={`/dashboard/task-based/${employeeId}`}
              replace
              className="w-full py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
            >
              Go to Dashboard
            </Link>
          )}

          <button
            onClick={() => router.back()}
            className="text-sm text-gray-400 hover:text-gray-600 font-medium py-2"
          >
            Wait, Go Back
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/5 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-secondary mb-2">
            Create Product
          </h1>
          <p className="text-muted-text">
            Define specifications and assign tasks.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-white/50 p-6 md:p-8 space-y-8"
        >
          {/* Basic Info Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionHeader title="Basic Information" />

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <IoIosPerson className="text-lg text-primary" /> Client
              </label>
              {clientLoading ? (
                <div className="animate-pulse h-12 bg-gray-100 rounded-xl"></div>
              ) : (
                <select
                  name="clientId"
                  value={form.clientId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all cursor-pointer text-gray-700 font-medium"
                >
                  {clients.map((client, ind) => (
                    <option key={client._id} value={client._id}>
                      {ind + 1} : {client.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <InputGroup
              label="Sari Section"
              name="sariSection"
              value={form.sariSection}
              onChange={handleChange}
              icon={RiLayout3Fill}
              options={[
                { value: "body", label: "Body" },
                { value: "pallu", label: "Pallu" },
              ]}
            />
          </div>

          {/* Measurements Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SectionHeader title="Measurements" />

            <InputGroup
              label="Nails Count"
              name="nailsCount"
              value={form.nailsCount}
              onChange={handleChange}
              icon={GiNails}
            />
            <InputGroup
              label="Cones Used"
              name="conesUsed"
              value={form.conesUsed}
              onChange={handleChange}
              icon={BiSolidTrafficCone}
            />
            <InputGroup
              label="Kolukkulu"
              name="kolukkulu"
              value={form.kolukkulu}
              onChange={handleChange}
              icon={PiNumberEightLight}
            />
            <InputGroup
              label="Varasalu"
              name="varasalu"
              value={form.varasalu}
              onChange={handleChange}
              icon={MdOutlineRepeat}
            />
            <InputGroup
              label="Repeat Times"
              name="repeat"
              value={form.repeat}
              onChange={handleChange}
              icon={BsArrowCounterclockwise}
            />
            <InputGroup
              label="Sarees Count"
              name="sareesCount"
              value={form.sareesCount}
              onChange={handleChange}
              icon={LuTally5}
            />

            {/* Calculated Stat */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col justify-center items-center text-center col-span-full sm:col-span-1 lg:col-span-3">
              <span className="text-sm text-primary font-bold uppercase tracking-wider mb-1">
                Calculated Vaatam
              </span>
              <span className="text-3xl font-black text-secondary">
                {vaatam.toFixed(2)}
              </span>
            </div>

            {!hidePays && (
              <div className="col-span-full">
                <InputGroup
                  label="Pay Amount (₹)"
                  name="pays"
                  value={form.pays}
                  onChange={handleChange}
                  icon={GiTakeMyMoney}
                />
              </div>
            )}
          </div>

          {/* Design Info Group */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SectionHeader title="Design Details" />

            <InputGroup
              label="Design Name"
              name="designName"
              type="text"
              value={form.designName}
              onChange={handleChange}
              icon={MdDriveFileRenameOutline}
            />

            <InputGroup
              label="Repeat Type"
              name="repeatType"
              value={form.repeatType}
              onChange={handleChange}
              options={[
                { value: "Airplane", label: "Airplane" },
                { value: "Raan Boone", label: "Raan Boone" },
              ]}
            />

            <InputGroup
              label="Border Inches"
              name="borderInches"
              type="text"
              value={form.borderInches}
              onChange={handleChange}
              icon={PiMapPinSimpleAreaFill}
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                loading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  : "bg-primary text-white hover:bg-primary/90 hover:-translate-y-1 hover:shadow-primary/30"
              }`}
            >
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  Processing...
                </>
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
      {isOpen && (
        <Popup onClose={() => setIsOpen(false)} employeeId={employeeId} />
      )}
    </div>
  );
}
