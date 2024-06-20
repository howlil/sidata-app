import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const StatusTA = ({ variant, label }) => {
  const baseStyle =
    "inline-flex items-center px-6 py-2 rounded-full text-sm font-semibold";
  const variants = {
    belumAda: "bg-purple-600 text-white",
    ide: "bg-green-600 text-white",
    judul: "bg-red-600 text-white",
    proposal: "bg-orange-600 text-white",
  };

  return (
    <section>
      <p className="mb-2">Status Tugas Akhir</p>
      <span className={clsx(baseStyle, variants[variant])}>{label}</span>
    </section>
  );
};

StatusTA.propTypes = {
  variant: PropTypes.oneOf(["belumAda", "ide", "judul", "proposal"]).isRequired,
  label: PropTypes.string.isRequired,
};

export default StatusTA;
