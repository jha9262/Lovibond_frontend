import React, { useState } from "react";
import AddDeviceForm from "../components/AddDeviceForm";
import ShowDevices from "../components/ShowDevices";
import { Plus, X } from "lucide-react";
import { Button as UIButton } from "../components/ui";

const DeviceConfiguration = ({ isEmbedded = false }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className={isEmbedded ? "" : "min-h-screen bg-industrial-50 p-4 sm:p-6 lg:p-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]"}>
      <div className={isEmbedded ? "" : "max-w-[1400px] mx-auto"}>
        {!isEmbedded && (
          <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-industrial-900 tracking-tight uppercase">
                DEVICE CONFIGURATION
              </h1>
              <p className="text-industrial-500 text-sm mt-1">Add and manage connected modbus devices</p>
            </div>
            
            {/* Mobile Add Device Button */}
            <div className="lg:hidden">
              <UIButton
                variant={isFormOpen ? "secondary" : "primary"}
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="w-full sm:w-auto shadow-lg shadow-orange-500/10"
                icon={isFormOpen ? X : Plus}
                label={isFormOpen ? "CLOSE" : "ADD NEW DEVICE"}
              />
            </div>
          </header>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          {/* Desktop View: Static Sidebar */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
            <AddDeviceForm />
          </div>
          
          {/* Mobile View: Modal Overlay */}
          {isFormOpen && (
            <div className="lg:hidden fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                onClick={() => setIsFormOpen(false)}
              />
              <div className="relative w-full max-w-md animate-in zoom-in-95 duration-200">
                <div className="absolute -top-12 right-0">
                  <button 
                    onClick={() => setIsFormOpen(false)}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md border border-white/20"
                  >
                    <X size={20} />
                  </button>
                </div>
                <AddDeviceForm />
              </div>
            </div>
          )}
          
          <div className="lg:col-span-8 xl:col-span-9">
            <ShowDevices />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceConfiguration;