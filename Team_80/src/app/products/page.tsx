"use client";

import { useCreateProductMutation, useGetProductsQuery } from "@/state/api";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import Rating from "@/app/(components)/Rating";
import CreateProductModal from "./CreateProductModal";
import Image from "next/image";

type ProductFormData = {
	name: string;
	price: number;
	stockQuantity: number;
	rating: number;
};

type Product = {
	productId: string;
	name: string;
	price: number;
	stockQuantity: number;
	rating: number;
	imageUrl: string;
};

// Sample product list (fallback in case API fails)
const sampleProducts: Product[] = [
	{
		productId: "1",
		name: "Wireless Mouse",
		price: 29.99,
		stockQuantity: 20,
		rating: 4.5,
		imageUrl: "/images/mouse.png",
	},
	{
		productId: "2",
		name: "Mechanical Keyboard",
		price: 89.99,
		stockQuantity: 15,
		rating: 4.8,
		imageUrl: "/images/keyboard.png",
	},
	{
		productId: "3",
		name: "Noise Cancelling Headphones",
		price: 199.99,
		stockQuantity: 10,
		rating: 4.7,
		imageUrl: "/images/headphones.png",
	},
	{
		productId: "4",
		name: "Portable SSD (1TB)",
		price: 129.99,
		stockQuantity: 30,
		rating: 4.6,
		imageUrl: "/images/ssd.png",
	},
	{
		productId: "5",
		name: "Smartwatch",
		price: 149.99,
		stockQuantity: 25,
		rating: 4.3,
		imageUrl: "/images/smartwatch.png",
	},
];

const Products = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);

	const {
		data: products,
		isLoading,
		isError,
	} = useGetProductsQuery(searchTerm);

	const [createProduct] = useCreateProductMutation();
	const handleCreateProduct = async (productData: ProductFormData) => {
		await createProduct(productData);
	};

	return (
		<div className="mx-auto pb-5 w-full">
			{/* SEARCH BAR */}
			<div className="mb-6">
				<div className="flex items-center border-2 border-gray-200 rounded">
					<SearchIcon className="w-5 h-5 text-gray-500 m-2" />
					<input
						className="w-full py-2 px-4 rounded bg-white"
						placeholder="Search products..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			{/* HEADER BAR */}
			<div className="flex justify-between items-center mb-6">
				<Header name="Products" />
				<button
					type="button"
					className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
					onClick={() => setIsModalOpen(true)}
				>
					<PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> Create
					Product
				</button>
			</div>

			{/* BODY PRODUCTS LIST */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
				{isLoading ? (
					<div>Loading...</div>
				) : (
					(products?.length ? products : sampleProducts).map((product) => (
						<div
							key={product.productId}
							className="border shadow rounded-md p-4 max-w-full w-full mx-auto"
						>
							<div className="flex flex-col items-center">
								<h3 className="text-lg text-gray-900 font-semibold">
									{product.name}
								</h3>
								<p className="text-gray-800">${product.price.toFixed(2)}</p>
								<div className="text-sm text-gray-600 mt-1">
									Stock: {product.stockQuantity}
								</div>
								{product.rating && (
									<div className="flex items-center mt-2">
										<Rating rating={product.rating} />
									</div>
								)}
							</div>
						</div>
					))
				)}
			</div>

			{/* MODAL */}
			<CreateProductModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onCreate={handleCreateProduct}
			/>
		</div>
	);
};

export default Products;
