'use client'

import Image from "next/image";
import { ImageStore } from "@/lib/image-store";
import { LayerStore } from "@/lib/layer-store";
import Editor from "@/components/editor";

export default function Home() {
  return (

    <div>
      <LayerStore.Provider initialValue={{
        layerComparisonMode: false,
        layers: [{
          id: crypto.randomUUID(),
          url: "",
          height: 0,
          width: 0,
          publicId: "",
        },
        ],
      }}
      >
        <ImageStore.Provider initialValue={{
          activeTag: "all",
          activeColor: "green",
          activeImage: "",
        }}>
          <main className="h-full">
            <Editor />
          </main>
        </ImageStore.Provider>
      </LayerStore.Provider>
    </div >
  );
}
