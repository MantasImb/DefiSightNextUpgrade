"use client";
import React, { useState } from "react";
import { api } from "~/utils/api";
import { z } from "zod";

const walletSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]+$/, { message: "Invalid address" }),
  chainId: z.number(),
  tag: z.string().min(1, { message: "Please define a tag." }).max(20),
  highlight: z.enum(["red", "green", "blue", "yellow"]),
});

function WalletForm() {
  const { mutate } = api.wallet.add.useMutation();

  const [formErrors, setFormErrors] = useState({
    address: "",
    tag: "",
  });

  const [walletInfo, setWalletInfo] = useState({
    address: "0x",
    chainId: 11155111,
    tag: "",
    highlight: "red",
  });

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    // The selector automatically casts the value to a string, so we need to cast it back to a number if the name is chainId
    let v: number | string;
    if (name === "chainId") {
      v = parseInt(value);
    } else {
      v = value;
    }

    // Reset the error message for the field
    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: "",
    }));

    // Update the walletInfo state
    setWalletInfo((prevWalletInfo) => ({
      ...prevWalletInfo,
      [name]: v,
    }));
  }

  function handleSubmit() {
    try {
      // Validate the walletInfo object against the schema
      const validatedInfo = walletSchema.parse(walletInfo);
      // If the validation passes, then we can call the mutate function
      mutate({
        walletAddress: validatedInfo.address,
        walletChainId: validatedInfo.chainId,
        walletTag: validatedInfo.tag,
        walletHighlight: validatedInfo.highlight,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // If the error is a ZodError, then we can flatten it to get the field errors
        const errors = error.flatten();
        setFormErrors((prevFormErrors) => ({
          ...prevFormErrors,
          ...errors.fieldErrors,
        }));
      }
    }
  }

  return (
    <div className="flex flex-col">
      <h2 className="text-white">New Wallet Form</h2>
      <label className="text-white">Wallet Address</label>
      <input
        name="address"
        onChange={handleChange}
        value={walletInfo.address}
      />
      {formErrors["address"] && (
        <label className="text-red-500">{formErrors["address"]}</label>
      )}
      <label className="text-white">Chain</label>
      <select name="chainId" onChange={handleChange} value={walletInfo.chainId}>
        <option value={1} defaultChecked>
          Ethereum Mainnet
        </option>
        <option value={56} itemType="number">
          Binance Smart Chain
        </option>
        <option value={42161}>Arbitrum One</option>
        <option value={11155111}>Sepolia Testnet</option>
      </select>
      <label className="text-white">Tag</label>
      <input
        name="tag"
        onChange={handleChange}
        value={walletInfo.tag}
        maxLength={20}
      />
      {formErrors["tag"] && (
        <label className="text-red-500">{formErrors["tag"]}</label>
      )}
      <label className="text-white">Highlight</label>
      <select name="highlight" onChange={handleChange}>
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
        <option value="yellow">Yellow</option>
      </select>
      <button onClick={handleSubmit} className="text-white">
        Submit
      </button>
    </div>
  );
}

export default WalletForm;
