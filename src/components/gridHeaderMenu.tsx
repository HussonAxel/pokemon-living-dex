import { Link } from '@tanstack/react-router'
import { headerLinks } from '@/data/consts/headerLinks'
import { usePrefetchAllBerriesWithData } from '@/data/queries/pokemons'

interface gridHeaderMenuProps {}

export default function GridHeaderMenu({}: gridHeaderMenuProps) {
  const homePage = headerLinks[0]

  return (
    <nav className="h-screen">
      <div className="flex flex-col md:h-full md:gap-4 xl:flex-row mx-4 md:mx-12">
        <div className="w-full xl:w-[700px] flex-shrink-0 mb-8 md:mb-0 mt-12 xl:my-12">
          <Link
            to={'/'}
          >
            <div className="border-[0.5px] border-black rounded-[20px] h-full p-6 transition-colors duration-500 ease-in-out hover:bg-[#ef4036] hover:text-white flex flex-col hover:cursor-pointer">
              <div className="flex flex-col justify-between h-full">
                <div className="flex flex-row justify-between">
                    <p className="text-2xl font-bold">{homePage.name}</p>
                </div>
                <div className="flex flex-col gap-6">
                  <p className="text-3xl font-bold">{homePage.name}</p>
                  <p className="text-md leading-relaxed flex-1 overflow-y-auto font-semibold">
                    {homePage.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide xl:my-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
            {headerLinks.slice(1).map((link) => (
              <Link
                to={link.slug}
                onMouseEnter={usePrefetchAllBerriesWithData()}
              >
                <div className="border-[0.5px] border-black rounded-[20px] p-6 transition-colors duration-500 ease-in-out hover:bg-[#ef4036] hover:text-white hover:cursor-pointer flex flex-col h-40 md:h-80">
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-row justify-between">
                      <p className="font-bold text-2xl">{link.name}</p>
                    </div>
                    <div className="flex flex-col gap-6">
                      <p className="text-md leading-relaxed flex-1 overflow-y-auto font-semibold">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
