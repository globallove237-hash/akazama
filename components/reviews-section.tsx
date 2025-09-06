"use client"

import { Star, Quote } from "lucide-react"
import { createWhatsAppLink } from "@/lib/whatsapp-manager"

export default function ReviewsSection() {
  const joinLink = createWhatsAppLink("Je veux rejoindre Global Love et trouver l'amour")

  const reviews = [
    {
      name: "Marie L.",
      age: 28,
      city: "Paris",
      rating: 5,
      text: "J'ai rencontré mon âme sœur grâce à Global Love ! L'algorithme est vraiment intelligent et les profils sont authentiques.",
      relationship: "En couple depuis 8 mois",
    },
    {
      name: "Thomas B.",
      age: 32,
      city: "Lyon",
      rating: 5,
      text: "Une expérience incroyable. Les conversations sont de qualité et j'ai fait de belles rencontres. Je recommande vivement !",
      relationship: "Fiancé",
    },
    {
      name: "Sophie M.",
      age: 26,
      city: "Marseille",
      rating: 5,
      text: "Enfin une app de rencontre qui privilégie la qualité ! J'ai trouvé quelqu'un qui partage vraiment mes valeurs.",
      relationship: "En relation sérieuse",
    },
    {
      name: "Alexandre D.",
      age: 35,
      city: "Toulouse",
      rating: 5,
      text: "Global Love a changé ma vision des rencontres en ligne. Des profils vérifiés et des connexions authentiques.",
      relationship: "Marié",
    },
  ]

  return (
    <section className="py-12 md:py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-4">
            Ils ont trouvé l'amour avec <span className="font-medium italic">Global Love</span>
          </h2>
          <p className="text-white/70 text-sm md:text-base max-w-2xl mx-auto px-4">
            Découvrez les témoignages de nos membres qui ont trouvé des relations authentiques et durables
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              <Quote className="w-5 md:w-6 h-5 md:h-6 text-white/30 mb-3" />

              <p className="text-white/80 text-sm leading-relaxed mb-4">{review.text}</p>

              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-medium text-sm">{review.name}</h4>
                    <p className="text-white/60 text-xs">
                      {review.age} ans, {review.city}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full">
                    {review.relationship}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <a
            href={joinLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 md:px-8 py-3 bg-white text-black rounded-full font-medium text-sm hover:bg-white/90 transition-colors"
          >
            Rejoignez-nous maintenant
          </a>
        </div>
      </div>
    </section>
  )
}
