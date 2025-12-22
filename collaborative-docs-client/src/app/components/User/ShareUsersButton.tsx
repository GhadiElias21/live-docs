"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useGetAllUsersQuery } from "@/store/api/userApi";
import ShareDocumentModal from "../Documents/ShareDocumentsModals/ShareDocumentModal";
import { User } from "@/store/api/authApi";
import {
  FiX,
  FiUsers,
  FiShare2,
  FiSearch,
  FiChevronLeft,
} from "react-icons/fi";
import {
  backdropVariants,
  contentVariants,
  modalVariants,
  userItemVariants,
} from "@/app/utils/animations/ShareUsersButton/shareUsersButton";

export default function ShareUsersButton() {
  const { data: users = [], isLoading } = useGetAllUsersQuery();
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="
          relative px-4 py-2.5 rounded-xl text-sm font-medium
          bg-gradient-to-r from-green-500/90 to-emerald-500/90 text-black
          shadow-[0_0_30px_rgba(34,197,94,0.3)]
          hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]
          transition-all duration-300
          overflow-hidden group
        "
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
        <span className="relative flex items-center gap-2">
          <FiShare2 className="w-4 h-4" />
          Share Document
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setOpen(false)}
              className="
                fixed inset-0 z-[9998] 
                bg-gradient-to-b from-black/90 via-black/80 to-emerald-950/20
                cursor-pointer
              "
            />

            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="
                fixed inset-0 md:inset-4 md:max-h-[90vh] md:max-w-2xl md:mx-auto md:my-auto
                z-[9999] 
                bg-gradient-to-b from-gray-900 via-gray-900 to-black
                border border-green-500/10
                shadow-[0_0_100px_rgba(34,197,94,0.1)]
                overflow-hidden
                flex flex-col
              "
            >
              {/* Modal header */}
              <div
                className="
                relative p-6 pb-4
                border-b border-green-500/10
                bg-gradient-to-r from-gray-900/50 via-gray-900/30 to-transparent
              "
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setOpen(false)}
                      className="
                        p-2 rounded-lg
                        bg-gray-800/50 hover:bg-gray-700/50
                        border border-green-500/10
                        text-gray-300 hover:text-green-400
                        transition-colors
                        md:hidden
                      "
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </motion.button>

                    <div>
                      <h2
                        className="
                        text-xl font-bold
                        bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent
                      "
                      >
                        Share Document
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">
                        Select a user to share with
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpen(false)}
                    className="
                    cursor-pointer
                      p-2 rounded-lg
                      bg-gray-800/50 hover:bg-gray-700/50
                      border border-green-500/10
                      text-gray-300 hover:text-green-400
                      transition-colors
                      hidden md:block
                    "
                  >
                    <FiX className="w-5 h-5 " />
                  </motion.button>
                </div>

                {/* Search bar */}
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-6"
                >
                  <div className="relative">
                    <FiSearch
                      className="
                      absolute left-3 top-1/2 transform -translate-y-1/2
                      w-4 h-4 text-gray-500
                    "
                    />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="
                        w-full pl-10 pr-4 py-3
                        rounded-xl
                        bg-gray-800/50
                        border border-green-500/20
                        text-white placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-green-500/50
                        transition-all
                      "
                    />
                  </div>
                </motion.div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 pt-4">
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div
                        className="
                        w-12 h-12 rounded-full
                        border-2 border-green-500/30 border-t-green-500
                        animate-spin
                      "
                      />
                      <p className="mt-4 text-gray-400">Loading users...</p>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <FiUsers
                        className="
                        w-16 h-16 mx-auto mb-4
                        text-gray-700
                      "
                      />
                      <p className="text-gray-400">
                        {searchQuery ? "No users found" : "No users available"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredUsers.map((user) => (
                        <motion.button
                          key={user._id}
                          variants={userItemVariants}
                          initial="initial"
                          whileHover="hover"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedUser(user);
                            setOpen(false);
                          }}
                          className="
                            relative p-4 rounded-xl text-left
                            bg-gradient-to-br from-gray-800/50 to-gray-900/50
                            border border-green-500/10
                            hover:border-green-500/30
                            hover:bg-gray-800/70
                            transition-all duration-300
                            overflow-hidden group
                            cursor-pointer
                          "
                        >
                          {/* Hover glow effect */}
                          <div
                            className="
                            absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0
                            opacity-0 group-hover:opacity-100
                            transition-opacity duration-500
                          "
                          />

                          <div className="relative">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3
                                  className="
                                  font-medium text-white
                                  group-hover:text-green-300
                                  transition-colors
                                "
                                >
                                  {user.username}
                                </h3>
                                <p
                                  className="
                                  text-sm text-gray-400 mt-1
                                  group-hover:text-gray-300
                                  transition-colors
                                "
                                >
                                  {user.email}
                                </p>
                              </div>

                              <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="
                                  flex items-center justify-center
                                  w-8 h-8 rounded-lg
                                  bg-green-500/10
                                  text-green-400
                                  group-hover:bg-green-500/20
                                  transition-colors
                                "
                              >
                                <FiShare2 className="w-4 h-4" />
                              </motion.div>
                            </div>

                            <motion.div
                              initial={{ scaleX: 0 }}
                              whileHover={{ scaleX: 1 }}
                              className="
                                absolute -bottom-1 left-0 right-0
                                h-0.5 bg-gradient-to-r from-green-500 to-emerald-400
                                origin-left
                              "
                            />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Footer */}
              <div
                className="
                p-6 pt-4
                border-t border-green-500/10
                bg-gradient-to-t from-gray-900/80 to-transparent
              "
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {filteredUsers.length} user
                    {filteredUsers.length !== 1 ? "s" : ""} found
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpen(false)}
                    className="
                      px-4 py-2 rounded-lg
                      bg-gray-800 hover:bg-gray-700
                      border border-green-500/10
                      text-gray-300 hover:text-white
                      transition-all
                      cursor-pointer

                    "
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {selectedUser && (
        <ShareDocumentModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
}
